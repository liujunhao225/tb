/**
 * 店铺操作
 */
package com.oscar.oscar.action;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.RowBounds;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.oscar.oscar.bean.ProductNolocalBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.ShSubBean;
import com.oscar.oscar.bean.ShopBean;
import com.oscar.oscar.bean.ShopOrderBean;
import com.oscar.oscar.bean.ShopOrderDiffLogBean;
import com.oscar.oscar.bean.ShopOrderMatchDetailBean;
import com.oscar.oscar.bean.ShopOrderUploadBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ProductNolocalMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.ShSubMapper;
import com.oscar.oscar.service.ShopMapper;
import com.oscar.oscar.service.ShopOrderDiffLogMapper;
import com.oscar.oscar.service.ShopOrderMapper;
import com.oscar.oscar.service.ShopOrderUploadMapper;
import com.oscar.oscar.service.StoreHouseMapper;
import com.oscar.oscar.util.FileSaveUtil;
import com.oscar.oscar.util.FileUploadBean;
import com.oscar.oscar.util.MD5Utils;
import com.oscar.oscar.util.OrderFileMakerTool;
import com.oscar.oscar.util.SystemDictionary;

@Component
@Controller
@RequestMapping("/shopOrder")
public class ShopOrderAction {

	@Autowired
	private ShopOrderMapper shopOrderMapper;
	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private StoreHouseMapper storeHouseMapper;
	@Autowired
	private ShopOrderDiffLogMapper log;
	@Autowired
	private ShopMapper shopMapper;
	@Autowired
	private ProductNolocalMapper productNoLocalMapper;
	@Autowired
	private ShSubMapper shSubMapper;
	@Autowired
	private ShopOrderUploadMapper ShopOrderUploadMapper;

	private static Map<String, String> relationShipmap;

	private static Map<String, String> columnNameMap;

	// private final static String path = "d:/";

	static {
		relationShipmap = new HashMap<String, String>();
		relationShipmap.put("时间标记", "time");
		relationShipmap.put("店铺名称", "shopName");
		relationShipmap.put("商品编码", "productCode");
		relationShipmap.put("尺码", "size");
		relationShipmap.put("数量", "count");
		relationShipmap.put("仓位", "storePlace");
		relationShipmap.put("订单备忘", "orderNote");
		relationShipmap.put("订单号", "orderId");
		relationShipmap.put("快递号", "expressId");
		relationShipmap.put("渠道优化", "channel");
		relationShipmap.put("备注", "note");
		relationShipmap.put("发货方式", "deliveryMethod");
		relationShipmap.put("姓名", "consigneeName");
		relationShipmap.put("电话", "telephone");
		relationShipmap.put("地址", "address");
		relationShipmap.put("邮编", "zipCode");
		relationShipmap.put("订单编号", "orderCode");
		relationShipmap.put("运费", "freight");
		relationShipmap.put("价格", "price");
		columnNameMap = new HashMap<String, String>();
		columnNameMap.put("shopName", "店铺名称");
		columnNameMap.put("productCode", "商品编码");
		columnNameMap.put("count", "数量");
		columnNameMap.put("orderCode", "订单编号");
		columnNameMap.put("orderId", "订单号");
	}

	@RequestMapping("/index.do")
	public String index() {
		return "/shoporder/shoporder";
	}

	@RequestMapping("/shopUploadIndex.do")
	public String shopUploadIndex() {
		return "/shoporder/shopUpload";
	}

	@RequestMapping("/express.do")
	public String toExpress() {
		return "/shoporder/express";
	}

	@RequestMapping("/verify.do")
	public String toVerify() {
		return "/shoporder/verify";
	}

	@RequestMapping("/getShopOrderUploadList.do")
	@ResponseBody
	public String getShopOrderUploadList(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String fileName = request.getParameter("fileName");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<ShopOrderUploadBean> list = ShopOrderUploadMapper
				.getShopOrderUploadList(fileName, new RowBounds(startNum,
						limitNum));

		json.put("datalist", list);

		System.out.println(json.toString());
		int totalRecords = ShopOrderUploadMapper
				.getShopOrderUploadCount(fileName);
		json.put("totalRecords", totalRecords);
		return json.toString();
	}

	@RequestMapping("/delShopOrderUploadFile.do")
	@ResponseBody
	public String delShopOrderUploadFile(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String id = request.getParameter("id");
		ShopOrderUploadMapper.delShopOrderUploadFile(id);
		json.put("success", true);
		return json.toString();
	}

	/**
	 * 
	 * 上传订单文件
	 */
	@RequestMapping(value = "/uploadShopOrderFile", method = RequestMethod.POST)
	@ResponseBody
	public String uploadShopOrderFile(FileUploadBean files,
			HttpServletRequest request) {
		JSONObject json = new JSONObject();
		FileInputStream fis = null;
		Workbook wb = null;
		try {
			fis = (FileInputStream) files.getFile()[0].getInputStream();
			wb = WorkbookFactory.create(fis);
			Sheet ws = wb.getSheetAt(0);

			int columnNum = ws.getRow(0).getLastCellNum();// 总列数
			Map<String, Integer> ralstionShip = getRelationShip(ws.getRow(0),
					columnNum);
			json = checkUploadData(ws, ralstionShip);
			String resStatus = json.getString("status");
			if ("200".equals(resStatus)) {
				CommonsMultipartFile[] multiFiles = files.getFile();
				String name = null;
				CommonsMultipartFile multiFile = multiFiles[0];
				try {
					name = multiFile.getOriginalFilename();
					String isSec = FileSaveUtil.save(files,
							SystemDictionary.FilePath.UPLOAD_FILE_ORDER_PATH);
					if ("".equals(isSec)) {
						json.put("success", "false");
						return json.toString();
					}

				} catch (Exception e) {
					json.put("success", "false");
					return json.toString();
				}
				json.put("success", "true");
				if (!"".equals(name)) {
					ShopOrderUploadBean bean = new ShopOrderUploadBean();
					bean.setFileName(name);
					bean.setUploadeTime(new Date());
					ShopOrderUploadMapper.addShopOrderFile(bean);
				} else {
					json.put("success", "false");
				}
			}

		} catch (Exception e) {
			json.put("success", "false");
			json.put("status", "500");
			json.put("mess", "系统繁忙！导入失败");
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return json.toString();
	}

	@RequestMapping("/getShopOrderList.do")
	@ResponseBody
	public String getShopOrderList(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String f_file_id = request.getParameter("f_file_id");
		String orderId = request.getParameter("orderId");
		String shopName = request.getParameter("shopName");
		String islocal = request.getParameter("isLocal");
		String state = request.getParameter("state");
		String expressId = request.getParameter("expressId");
		String orderCode = request.getParameter("orderCode");
		String isHaveProductFlag = request.getParameter("isHaveProductFlag");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<ShopOrderBean> list = shopOrderMapper.getShopOrderList(orderId,
				shopName, islocal, state, expressId, orderCode,
				isHaveProductFlag, f_file_id, new RowBounds(startNum, limitNum));
		json.put("datalist", list);
		int totalRecords = shopOrderMapper.getShopOrderCount(orderId, shopName,
				islocal, state, expressId, orderCode, isHaveProductFlag, f_file_id);
		json.put("totalRecords", totalRecords);
		return json.toString();
	}

	@RequestMapping("/addShopOrder.do")
	@ResponseBody
	public String addShopOrder(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String orderId = request.getParameter("orderId");
		String orderCode = request.getParameter("orderCode");
		String count = request.getParameter("count");
		String productCode = request.getParameter("productCode");
		String size = request.getParameter("size");
		String price = request.getParameter("price");
		String orderNote = request.getParameter("orderNote");
		String shopName = request.getParameter("shopName");
		String time = request.getParameter("time");
		String storePlace = request.getParameter("storePlace");
		String isLocal = request.getParameter("isLocal");
		int countNum = Integer.parseInt(count);
		int isLocalNum = Integer.parseInt(isLocal);

		ShopOrderBean shopOrderBean = new ShopOrderBean();
		shopOrderBean.setCount(countNum);
		shopOrderBean.setOrderId(orderId);
		shopOrderBean.setProductCode(productCode);
		shopOrderBean.setSize(size);
		shopOrderBean.setPrice(price);
		shopOrderBean.setShopName(shopName);
		shopOrderBean.setOrderNote(orderNote);
		shopOrderBean.setOrderCode(orderCode);
		shopOrderBean.setIsHaveProductFlag("1");
		shopOrderBean.setState("1");
		shopOrderBean.setIsLocal(isLocalNum);
		shopOrderBean.setTime(time);
		shopOrderBean.setStorePlace(storePlace);

		json = matchAndReduceStoreCount(shopOrderBean);
		String resStatus = json.getString("status");
		if ("200".equals(resStatus)) {
			try {
				if (isLocalNum == 0) {
					ShSubBean shSubBean = shSubMapper
							.getShSubBeanDesc(storePlace);
					StoreHouseBean storeHouseBean = storeHouseMapper
							.getStoreHouseBeanById(shSubBean.getShId());
					shopOrderBean.setChannel(storeHouseBean.getShName());
				} else {
					shopOrderBean.setChannel(storePlace);
				}
				shopOrderMapper.saveShopOrder(shopOrderBean);
				json.put("success", true);
				json.put("status", "200");
				json.put("mess", "新增成功");
			} catch (Exception e) {
				shProductMapper.updateshProductBeanForCount(productCode,
						storePlace, countNum, size);
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "系统繁忙");
			}

		}

		return json.toString();
	}

	@RequestMapping("/updateShopOrder.do")
	@ResponseBody
	public String updateShopOrder(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String id = request.getParameter("id");
		String orderId = request.getParameter("orderId");
		String orderCode = request.getParameter("orderCode");
		String count = request.getParameter("count");
		String productCode = request.getParameter("productCode");
		String size = request.getParameter("size");
		String price = request.getParameter("price");
		String orderNote = request.getParameter("orderNote");
		String shopName = request.getParameter("shopName");
		String time = request.getParameter("time");
		String storePlace = request.getParameter("storePlace");
		String isLocal = request.getParameter("isLocal");
		int countNum = Integer.parseInt(count);
		int isLocalNum = Integer.parseInt(isLocal);
		long idNum = Long.parseLong(id);

		ShopOrderBean shopOrderBean = new ShopOrderBean();
		shopOrderBean.setId(idNum);
		shopOrderBean.setCount(countNum);
		shopOrderBean.setOrderId(orderId);
		shopOrderBean.setProductCode(productCode);
		shopOrderBean.setSize(size);
		shopOrderBean.setPrice(price);
		shopOrderBean.setShopName(shopName);
		shopOrderBean.setOrderNote(orderNote);
		shopOrderBean.setOrderCode(orderCode);
		shopOrderBean.setIsHaveProductFlag("1");
		shopOrderBean.setState("1");
		shopOrderBean.setIsLocal(isLocalNum);
		shopOrderBean.setTime(time);
		shopOrderBean.setStorePlace(storePlace);

		ShopOrderBean oldBean = shopOrderMapper.getShopOrderDesc(idNum);
		String oldproductCode = oldBean.getProductCode();
		String oldSize = oldBean.getSize();
		int oldCount = oldBean.getCount();
		String oldIsHaveFlag = oldBean.getIsHaveProductFlag();
		String oldStorePlace = oldBean.getStorePlace();
		if ("1".equals(oldIsHaveFlag)) {
			if (productCode.equals(oldproductCode) && size.equals(oldSize)
					&& storePlace.equals(oldStorePlace) && countNum == oldCount) {
				shopOrderMapper.updateShopOrder(shopOrderBean);
				json.put("success", true);
				json.put("status", "200");
				json.put("mess", "更新成功");
			} else {
				json = restoreStoreCount(oldBean);
				String status = json.getString("status");
				if ("200".equals(status)) {
					json = matchAndReduceStoreCount(shopOrderBean);
					String resStatus = json.getString("status");
					if ("200".equals(resStatus)) {

						try {
							if (isLocalNum == 0) {
								ShSubBean shSubBean = shSubMapper
										.getShSubBeanDesc(storePlace);
								StoreHouseBean storeHouseBean = storeHouseMapper
										.getStoreHouseBeanById(shSubBean
												.getShId());
								shopOrderBean.setChannel(storeHouseBean
										.getShName());
							} else {
								shopOrderBean.setChannel(storePlace);
							}
							shopOrderMapper.updateShopOrder(shopOrderBean);
							json.put("success", true);
							json.put("status", "200");
							json.put("mess", "更新成功");
						} catch (Exception e) {
							storePlace = MD5Utils.MD5(storePlace);
							shProductMapper.updateshProductBeanForCount(
									productCode, storePlace, countNum, size);
							oldBean.setCount(-oldBean.getCount());
							json = restoreStoreCount(oldBean);
							json.put("success", true);
							json.put("status", "500");
							json.put("mess", "系统繁忙");
						}

					} else {
						oldBean.setCount(-oldBean.getCount());
						json = restoreStoreCount(oldBean);
					}
				}
			}
		} else {
			json = matchAndReduceStoreCount(shopOrderBean);
			String resStatus = json.getString("status");
			if ("200".equals(resStatus)) {

				try {

					if (isLocalNum == 0) {
						ShSubBean shSubBean = shSubMapper
								.getShSubBeanDesc(storePlace);
						StoreHouseBean storeHouseBean = storeHouseMapper
								.getStoreHouseBeanById(shSubBean.getShId());
						shopOrderBean.setChannel(storeHouseBean.getShName());
					} else {
						shopOrderBean.setChannel(storePlace);
					}

					shopOrderMapper.updateShopOrder(shopOrderBean);
					json.put("success", true);
					json.put("status", "200");
					json.put("mess", "更新成功");
				} catch (Exception e) {
					shProductMapper.updateshProductBeanForCount(productCode,
							storePlace, countNum, size);
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "系统繁忙");
				}

			}
		}

		return json.toString();
	}

	@RequestMapping("/uploadExpress.do")
	@ResponseBody
	public String uploadExpress(FileUploadBean files, HttpServletRequest request) {
		JSONObject json = new JSONObject();
		FileInputStream fis = null;
		Workbook wb = null;
		String message = "";
		try {
			fis = (FileInputStream) files.getFile()[0].getInputStream();
			wb = WorkbookFactory.create(fis);
			Sheet ws = wb.getSheetAt(0);
			// 总列数
			int columnNum = ws.getRow(0).getLastCellNum();
			// 总行数
			int rowNum = ws.getLastRowNum() + 1;
			Map<String, Integer> ralstionShip = getRelationShip(ws.getRow(0),
					columnNum);
			for (int i = 1; i < rowNum; i++) {
				Row row = ws.getRow(i);
				if (row != null) {
					ShopOrderBean bean = getBeanFromRow(row, ralstionShip);
					String expressId = bean.getExpressId();
					if (expressId != null) {
						ShopOrderBean oldShopOrderBean = shopOrderMapper
								.getShopOrderBean(bean);
						if (oldShopOrderBean != null) {
							String isHaveProduct = oldShopOrderBean
									.getIsHaveProductFlag();
							if ("1".equals(isHaveProduct)) {
								bean.setState("5");
							} else {
								bean.setState(oldShopOrderBean.getState());
							}
							bean.setId(oldShopOrderBean.getId());
							shopOrderMapper.updateExpressById(bean);
						} else {
							message += "第" + (i + 1) + "行，数据库中没有查询到数据。<br>";
						}
					} else {
						message += "第" + (i + 1) + "行，快递号为空。<br>";
					}
				}
			}

			if ("".equals(message)) {
				json.put("success", true);
				json.put("status", "200");
			} else {
				json.put("success", true);
				json.put("status", "200");
				json.put("mess", message);
			}
		} catch (Exception e) {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "系统繁忙！导入失败");
		}
		return json.toString();
	}

	@RequestMapping("/uploadShopOrder.do")
	@ResponseBody
	public String uploadShopOrder(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		FileInputStream fis = null;
		Workbook wb = null;
		try {
			String id = request.getParameter("id");// 文件 ID
			ShopOrderUploadBean shopOrderUploadBean = ShopOrderUploadMapper
					.getShopOrderFileById(id);
			fis = new FileInputStream(
					SystemDictionary.FilePath.UPLOAD_FILE_ORDER_PATH
							+ shopOrderUploadBean.getFileName());
			wb = WorkbookFactory.create(fis);
			Sheet ws = wb.getSheetAt(0);

			int columnNum = ws.getRow(0).getLastCellNum();// 总列数
			int rowNum = ws.getLastRowNum() + 1;// 总行数

			Map<String, Integer> ralstionShip = getRelationShip(ws.getRow(0),
					columnNum);
			json = checkUploadData(ws, ralstionShip);
			String resStatus = json.getString("status");
			if ("200".equals(resStatus)) {
				Set<String> shopSet = new HashSet<String>();
				Map<String, Map<String, List<ShopOrderBean>>> shopOrders = new HashMap<String, Map<String, List<ShopOrderBean>>>();
				for (int i = 1; i < rowNum; i++) {
					Row row = ws.getRow(i);
					if (row != null) {
						ShopOrderBean bean = getBeanFromRow(row, ralstionShip);
						bean.setFileId(Long.parseLong(id));
						String shopName = bean.getShopName();
						String orderId = bean.getOrderId();
						Map<String, List<ShopOrderBean>> shopListMap = shopOrders
								.get(shopName);
						if (shopListMap == null) {
							shopListMap = new HashMap<String, List<ShopOrderBean>>();
							shopOrders.put(shopName, shopListMap);
						}
						List<ShopOrderBean> orderList = shopListMap
								.get(orderId);
						if (orderList == null) {
							orderList = new ArrayList<ShopOrderBean>();
							shopListMap.put(orderId, orderList);
						}
						orderList.add(bean);
						shopSet.add(shopName);
					}
				}
				String[] levelList = getShopLevel(shopSet);
				if (levelList != null) {
					for (int i = 0; i < levelList.length; i++) {
						String shopName = levelList[i];
						Map<String, List<ShopOrderBean>> shopListMap = shopOrders
								.get(shopName);
						for (String key : shopListMap.keySet()) {
							List<ShopOrderBean> list = shopListMap.get(key);
							if (list != null && !list.isEmpty()) {
								matchShopOrder(list);
							}
						}
					}
					ShopOrderUploadMapper.updategetShopOrderFileMatchStatus(id,
							"2");
					json.put("success", true);
					json.put("status", "200");
					json.put("mess", "导入成功");

				} else {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "系统繁忙！导入失败");
				}
			}

		} catch (Exception e) {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "系统繁忙！导入失败");
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return json.toString();
	}

	@RequestMapping("/updateExpress.do")
	@ResponseBody
	public String updateExpress(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String id = request.getParameter("id");
		String expressId = request.getParameter("expressId");
		String channel = request.getParameter("channel");
		String freight = request.getParameter("freight");
		String zipCode = request.getParameter("zipCode");
		String address = request.getParameter("address");
		String telephone = request.getParameter("telephone");
		String consigneeName = request.getParameter("consigneeName");
		String deliveryMethod = request.getParameter("deliveryMethod");
		String note = request.getParameter("note");
		ShopOrderBean shopOrderBean = shopOrderMapper.getShopOrderDesc(Long
				.parseLong(id));
		shopOrderBean.setExpressId(expressId);
		shopOrderBean.setChannel(channel);
		shopOrderBean.setFreight(freight);
		shopOrderBean.setZipCode(zipCode);
		shopOrderBean.setAddress(address);
		shopOrderBean.setTelephone(telephone);
		shopOrderBean.setConsigneeName(consigneeName);
		shopOrderBean.setDeliveryMethod(deliveryMethod);
		shopOrderBean.setNote(note);
		String isHaveProduct = shopOrderBean.getIsHaveProductFlag();
		if ("1".equals(isHaveProduct)) {
			shopOrderBean.setState("5");
		}
		int count = shopOrderMapper.updateExpressById(shopOrderBean);
		if (count == 1) {
			json.put("success", true);
			json.put("status", "200");
			json.put("mess", "修改成功！");
		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "系统繁忙！");
		}
		return json.toString();
	}

	@RequestMapping("/deleteShopOrder.do")
	@ResponseBody
	public String deleteShopOrder(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String id = request.getParameter("id");
		ShopOrderBean bean = shopOrderMapper.getShopOrderDesc(Long
				.parseLong(id));

		String isHave = bean.getIsHaveProductFlag();
		String status = null;
		if ("1".equals(isHave)) {
			json = restoreStoreCount(bean);
			status = json.getString("status");
		}
		if (status == null || "200".equals(status)) {
			shopOrderMapper.deleteShopOrder(Long.parseLong(id));
			json.put("success", true);
			json.put("status", "200");
			json.put("mess", "删除成功！");
		}

		return json.toString();
	}

	@RequestMapping("/submitAbnormalOrder.do")
	@ResponseBody
	public String submitAbnormalOrder(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String id = request.getParameter("id");
		String desc = request.getParameter("desc");
		Long idNum = Long.parseLong(id);
		String userName = (String) request.getSession()
				.getAttribute("username");
		if (userName != null) {
			ShopOrderBean shopOrderBean = shopOrderMapper
					.getShopOrderDesc(idNum);
			String state = shopOrderBean.getState();
			if ("5".equals(state)) {
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "该订单已经出库不能提交异常审核");
			} else {
				int res = shopOrderMapper.updateShopOrderAbnornalState(idNum,
						"3", desc);
				if (res == 1) {
					ShopOrderDiffLogBean logBean = new ShopOrderDiffLogBean();
					logBean.setShopOrderId(idNum);
					logBean.setDescripion(desc);
					logBean.setState("A");
					logBean.setOperator(userName);
					logBean.setSubmitDate(new SimpleDateFormat(
							"yyyy-MM-dd HH-mm-ss").format(new Date()));
					log.addLog(logBean);

					json.put("success", true);
					json.put("status", "200");
					json.put("mess", "提交异常审核成功");
				}
			}

		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "请登录后在提交审核");
		}

		return json.toString();
	}

	@RequestMapping("/getShopOrderAbnormalCount.do")
	@ResponseBody
	public String getShopOrderAbnormalCount(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		int count = shopOrderMapper.getShopOrderCountByState("3");
		json.put("success", true);
		json.put("status", "200");
		json.put("count", count);
		return json.toString();
	}

	@RequestMapping("/getStorePlace")
	@ResponseBody
	public String getStorePlace(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String isLocal = request.getParameter("isLocal");
		String productSize = request.getParameter("size");
		String productId = request.getParameter("productCode");
		String countStr = request.getParameter("count");
		if (countStr == null || countStr.length() < 1) {
			countStr = "0";
		}
		int count = Integer.parseInt(countStr);
		JSONArray jsonArray = new JSONArray();
		if ("0".equals(isLocal)) {
			List<StoreHouseBean> storeHouseList = storeHouseMapper
					.getLocalStoreHouse();
			for (StoreHouseBean storeHouseBean : storeHouseList) {
				List<ShProductBean> ShProductBeanList = shProductMapper
						.matchShProduct(productId, productSize,
								storeHouseBean.getShId());
				for (ShProductBean ShProductBean : ShProductBeanList) {
					int storeCount = ShProductBean.getCount();
					if (storeCount >= count) {
						JSONObject jsonObject = new JSONObject();
						jsonObject.put("test", ShProductBean.getShSubId());
						jsonObject.put("value", ShProductBean.getShSubId());
						jsonArray.put(jsonObject);
					}
				}
			}
		} else {
			List<ProductNolocalBean> ProductNolocalBeanList = productNoLocalMapper
					.matchProduct(productId + "+" + productSize);
			for (ProductNolocalBean productNolocalBean : ProductNolocalBeanList) {
				if (productNolocalBean.getTotalCount() >= count) {
					JSONObject jsonObject = new JSONObject();
					StoreHouseBean storeHouseBean = storeHouseMapper
							.getStoreHouseBeanById(productNolocalBean
									.getShStoreId());
					jsonObject.put("test", storeHouseBean.getShName());
					jsonObject.put("value", storeHouseBean.getShName());
					jsonArray.put(jsonObject);
				}
			}
		}
		if (jsonArray.length() == 0) {
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("test", "没有库存信息");
			jsonObject.put("value", "没有库存信息");
			jsonArray.put(jsonObject);
		}
		json.put("list", jsonArray);
		return json.toString();
	}

	@RequestMapping("/filelist.do")
	@ResponseBody
	public String getFileNames() {
		List<ShopOrderUploadBean> shoplist =ShopOrderUploadMapper.getShopOrderUploadList(null,new RowBounds(0, 20));
		List<JSONObject> list = new ArrayList<JSONObject>();
		for(ShopOrderUploadBean bean:shoplist){
			JSONObject job = new JSONObject();
			job.put("file_id", bean.getId());
			job.put("file_name", bean.getFileName());
			list.add(job);
		}
		System.out.println(list.toString());
		return list.toString();
	}

	@RequestMapping("/makefile.do")
	@ResponseBody
	public String makefile(HttpServletRequest request,
			HttpServletResponse response) {
		String fileId = request.getParameter("id");

		List<ShopOrderBean> list = shopOrderMapper.downloadShopOrderList(Long
				.parseLong(fileId));

		Map<String, ShopOrderBean> map = new HashMap<String, ShopOrderBean>();
		for (ShopOrderBean bean : list) {
			map.put(bean.getOrderId(), bean);
		}

		ShopOrderUploadBean uploadBean = ShopOrderUploadMapper
				.getShopOrderFileById(fileId);

		try {
			String filePath = OrderFileMakerTool.makeExcel(
					uploadBean.getFileName(), map);
			if ("".equals(filePath)) {
				return "";
			}
			JSONObject job = new JSONObject();
			job.put("success", true);
			job.put("status", "200");
			return job.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	@SuppressWarnings("resource")
	@RequestMapping("/downLoadShopOrder.do")
	@ResponseBody
	public String downLoadShopOrder(HttpServletRequest request,
			HttpServletResponse response) {
		String fileId = request.getParameter("fileId");
		ShopOrderUploadBean uploadBean = ShopOrderUploadMapper
				.getShopOrderFileById(fileId);

		response.reset();
		response.setContentType("application/msexcel;charset=UTF-8");
		try {
			String filePath = SystemDictionary.FilePath.DOWNLOAD_FILE_ORDER_PATH
					+ uploadBean.getFileName();
			response.addHeader("Content-Disposition", "attachment;filename=\""
					+ new String(("订单明细表" + ".xlsx").getBytes("UTF-8"),
							"ISO8859_1") + "\"");
			java.io.OutputStream os = response.getOutputStream();
			InputStream in = null;
			in = new FileInputStream(filePath);
			int len = 0;
			byte[] buffer = new byte[1024];
			while ((len = in.read(buffer)) > 0) {
				os.write(buffer, 0, len);
			}
			// writer.write(os);
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private Map<String, List<ShProductBean>> dealData(List<ShProductBean> list) {
		Map<String, List<ShProductBean>> map = new HashMap<String, List<ShProductBean>>();
		if (list != null && !list.isEmpty()) {
			for (ShProductBean shProductBean : list) {
				List<ShProductBean> shProList = map
						.get(shProductBean.getShId());
				if (shProList == null) {
					shProList = new ArrayList<ShProductBean>();
					map.put(shProductBean.getShId(), shProList);
				}
				shProList.add(shProductBean);
			}
		}

		return map;
	}

	private ShProductBean getShProductBean(
			Map<String, List<ShProductBean>> map, int count) {
		Set<String> keySet = map.keySet();
		for (String key : keySet) {
			List<ShProductBean> list = map.get(key);
			for (ShProductBean shProductBean : list) {
				Integer tempCount = shProductBean.getCount();
				if (tempCount != null) {
					if (tempCount >= count) {
						return shProductBean;
					}
				}

			}
		}
		return null;
	}

	private ShopOrderBean getBeanFromRow(Row row,
			Map<String, Integer> ralstionShip) {
		ShopOrderBean bean = new ShopOrderBean();
		bean.setTime(getCellValue(row, ralstionShip, "time"));
		bean.setShopName(getCellValue(row, ralstionShip, "shopName"));
		bean.setAddress(getCellValue(row, ralstionShip, "address"));
		bean.setChannel(getCellValue(row, ralstionShip, "channel"));
		bean.setConsigneeName(getCellValue(row, ralstionShip, "consigneeName"));
		bean.setDeliveryMethod(getCellValue(row, ralstionShip, "deliveryMethod"));
		bean.setExpressId(getCellValue(row, ralstionShip, "expressId"));
		bean.setFreight(getCellValue(row, ralstionShip, "freight"));
		bean.setNote(getCellValue(row, ralstionShip, "note"));
		bean.setOrderCode(getCellValue(row, ralstionShip, "orderCode"));
		bean.setOrderId(getCellValue(row, ralstionShip, "orderId"));
		bean.setOrderNote(getCellValue(row, ralstionShip, "orderNote"));
		bean.setPrice(getCellValue(row, ralstionShip, "price"));
		bean.setProductCode(getCellValue(row, ralstionShip, "productCode"));
		bean.setSize(getCellValue(row, ralstionShip, "size"));
		bean.setState(getCellValue(row, ralstionShip, "state"));
		bean.setStorePlace(getCellValue(row, ralstionShip, "storePlace"));
		bean.setTelephone(getCellValue(row, ralstionShip, "telephone"));
		bean.setTime(getCellValue(row, ralstionShip, "time"));
		bean.setZipCode(getCellValue(row, ralstionShip, "zipCode"));
		String countStr = getCellValue(row, ralstionShip, "count");
		int count = Integer.parseInt(countStr);
		bean.setCount(count);
		return bean;
	}

	private String getCellValue(Row row, Map<String, Integer> ralstionShip,
			String key) {
		Integer index = ralstionShip.get(key);
		if (index != null) {
			Cell tempCell = row.getCell(index);
			if (tempCell != null) {
				tempCell.setCellType(HSSFCell.CELL_TYPE_STRING);
				return tempCell.toString();
			}
		}
		return null;
	}

	private Map<String, Integer> getRelationShip(Row row, int columnNum) {
		Map<String, Integer> map = new HashMap<String, Integer>();
		for (int i = 0; i < columnNum; i++) {
			Cell tempCell = row.getCell(i);
			if (tempCell == null) {
				continue;
			}
			String value = tempCell.toString();
			String key = relationShipmap.get(value);
			if (key != null) {
				map.put(key, i);
			}
		}
		return map;
	}

	private String matchShopOrder(List<ShopOrderBean> orderList) {
		JSONObject json = new JSONObject();
		// 查询本地仓库
		List<StoreHouseBean> storeHouseList = storeHouseMapper
				.getLocalStoreHouse();
		// 保存匹配成功的订单信息
		Map<String, List<ShopOrderMatchDetailBean>> sucProduct = new HashMap<String, List<ShopOrderMatchDetailBean>>();
		// 保存详细的匹配结果
		Map<String, List<ShopOrderMatchDetailBean>> orderMatchDesc = new HashMap<String, List<ShopOrderMatchDetailBean>>();
		// 遍历本地仓库
		for (StoreHouseBean storeHouseBean : storeHouseList) {
			String shId = storeHouseBean.getShId();
			// 遍历订单
			for (ShopOrderBean shopOrderBean : orderList) {
				String productCode1 = shopOrderBean.getProductCode();
				int index = productCode1.lastIndexOf("+");
				if (index != -1) {
					String productCode = productCode1.substring(0, index);
					String productSize = productCode1.substring(index + 1);
					shopOrderBean.setProductCode(productCode);
					shopOrderBean.setSize(productSize);
				}
				String productCode = shopOrderBean.getProductCode();
				String productSize = shopOrderBean.getSize();
				// 查询库存
				List<ShProductBean> shProductList = shProductMapper
						.matchShProduct(productCode, productSize, shId);
				// 订单商品数量
				int count = shopOrderBean.getCount();
				// 匹配到的商品的数量
				int matchCount = 0;
				for (ShProductBean shProductBean : shProductList) {
					// 匹配结果对象
					ShopOrderMatchDetailBean matchBean = new ShopOrderMatchDetailBean();
					List<ShopOrderMatchDetailBean> matchList = orderMatchDesc
							.get(productCode + productSize);
					if (matchList == null) {
						matchList = new ArrayList<ShopOrderMatchDetailBean>();
						orderMatchDesc
								.put(productCode + productSize, matchList);
					}
					matchBean.setOrderId(shopOrderBean.getOrderId());
					matchBean.setProductCode(productCode);
					matchBean.setProductSize(productSize);
					matchBean.setShId(shId);
					matchBean.setSubShId(shProductBean.getShSubId());
					matchBean.setIsLocal(0);
					matchList.add(matchBean);
					int storCount = shProductBean.getCount();
					// 数量充足
					if (storCount >= count) {
						matchCount += count;
						// 设置匹配数量
						matchBean.setCount(count);
						break;
					} else {
						// 设置本次匹配的数量
						matchCount += storCount;
						// 需要匹配的数量减少
						count -= storCount;
						// 设置本次匹配的数量
						matchBean.setCount(storCount);
					}
				}
				// 产品匹配成功 保存匹配成功信息
				if (matchCount == shopOrderBean.getCount()) {
					List<ShopOrderMatchDetailBean> matchList = orderMatchDesc
							.get(productCode + productSize);
					sucProduct.put(productCode + productSize, matchList);
				}
				// 订单的产品匹配成功
				if (sucProduct.size() == orderList.size()
						&& sucProduct.size() != 0) {
					break;
				}
			}
			// 订单的产品匹配成功
			if (sucProduct.size() == orderList.size() && sucProduct.size() != 0) {
				break;
			}
		}

		// 本地仓库订单的产品匹配成功
		if (sucProduct.size() == orderList.size() && sucProduct.size() != 0) {
			// 保存订单
			addShopOrder(orderList, sucProduct);
		} else {
			sucProduct = new HashMap<String, List<ShopOrderMatchDetailBean>>();
			Map<String, ShopOrderMatchDetailBean> remains = new HashMap<String, ShopOrderMatchDetailBean>();
			// 没有匹配成功则遍历本地所有仓库匹配结果
			for (ShopOrderBean shopOrderBean : orderList) {
				String productCode = shopOrderBean.getProductCode();
				String productSize = shopOrderBean.getSize();
				int count = shopOrderBean.getCount();
				List<ShopOrderMatchDetailBean> list = orderMatchDesc
						.get(productCode + productSize);
				if (list != null && !list.isEmpty()) {
					for (ShopOrderMatchDetailBean shopOrderMatchDetailBean : list) {
						int matchCount = shopOrderMatchDetailBean.getCount();
						List<ShopOrderMatchDetailBean> matchList = sucProduct
								.get(productCode + productSize);
						if (matchList == null) {
							matchList = new ArrayList<ShopOrderMatchDetailBean>();
							sucProduct
									.put(productCode + productSize, matchList);
						}
						matchList.add(shopOrderMatchDetailBean);
						if (matchCount >= count) {
							shopOrderMatchDetailBean.setCount(count);
							count = 0;
							break;
						} else {
							shopOrderMatchDetailBean.setCount(matchCount);
							count -= matchCount;
						}
					}

				}

				// 产品匹配还有剩余
				if (count > 0) {
					ShopOrderMatchDetailBean matchBean = new ShopOrderMatchDetailBean();
					matchBean.setCount(count);
					matchBean.setOrderId(shopOrderBean.getOrderId());
					matchBean.setOrderId(shopOrderBean.getOrderId());
					matchBean.setProductCode(productCode);
					matchBean.setProductSize(productSize);
					remains.put(productCode + productSize, matchBean);

				}
			}
			// 匹配成功
			if (remains.size() == 0) {
				// 保存订单
				addShopOrder(orderList, sucProduct);
			}
			// 匹配外地库
			else {
				boolean isMatchSuc = true;
				for (String key : remains.keySet()) {
					ShopOrderMatchDetailBean matchBean = remains.get(key);
					String productCode = matchBean.getProductCode();
					String productSize = matchBean.getProductSize();

					List<ProductNolocalBean> noLoaclList = productNoLocalMapper
							.matchProduct(productCode + "+" + productSize);
					int count = matchBean.getCount();
					for (ProductNolocalBean productNolocalBean : noLoaclList) {
						long storCount = productNolocalBean.getTotalCount();
						ShopOrderMatchDetailBean matchBeanSuc = new ShopOrderMatchDetailBean();
						matchBeanSuc.setOrderId(matchBean.getOrderId());
						matchBeanSuc.setProductCode(productCode);
						matchBeanSuc.setProductSize(productSize);
						matchBeanSuc.setShId(productNolocalBean.getShStoreId());
						matchBeanSuc.setIsLocal(2);
						List<ShopOrderMatchDetailBean> matchList = sucProduct
								.get(productCode + productSize);
						if (matchList == null) {
							matchList = new ArrayList<ShopOrderMatchDetailBean>();
							sucProduct
									.put(productCode + productSize, matchList);
						}
						matchList.add(matchBeanSuc);

						if (storCount >= count) {
							matchBeanSuc.setCount(count);
							count = 0;
							break;
						} else {
							matchBeanSuc.setCount((int) storCount);
							count -= storCount;
						}
					}
					// 匹配失败
					if (count != 0) {
						isMatchSuc = false;
						break;
					}
				}
				// 匹配成功 保存订单
				if (isMatchSuc) {
					// 保存订单
					addShopOrder(orderList, sucProduct);
				}
				// 匹配失败保存订单
				else {
					// 保存订单
					for (ShopOrderBean shopOrderBean : orderList) {
						shopOrderBean.setIsHaveProductFlag("2");
						shopOrderBean.setState("2");
						shopOrderMapper.saveShopOrder(shopOrderBean);
					}
				}

			}
		}
		return json.toString();
	}

	private void addShopOrder(List<ShopOrderBean> orderList,
			Map<String, List<ShopOrderMatchDetailBean>> sucProduct) {
		for (ShopOrderBean shopOrderBean : orderList) {
			String productCode = shopOrderBean.getProductCode();
			String productSize = shopOrderBean.getSize();
			List<ShopOrderMatchDetailBean> matchDetailList = sucProduct
					.get(productCode + productSize);
			for (ShopOrderMatchDetailBean shopOrderMatchDetailBean : matchDetailList) {
				int isLocal = shopOrderMatchDetailBean.getIsLocal();
				int count = shopOrderMatchDetailBean.getCount();
				String shId = shopOrderMatchDetailBean.getShId();
				String subShId = shopOrderMatchDetailBean.getSubShId();
				shopOrderBean.setCount(count);
				// 是否有货 1 有
				shopOrderBean.setIsHaveProductFlag("1");
				// 状态 1 匹配成功
				shopOrderBean.setState("1");
				shopOrderBean.setIsLocal(isLocal);
				StoreHouseBean storeHouseBean = storeHouseMapper
						.getStoreHouseBeanById(shId);
				shopOrderBean.setChannel(storeHouseBean.getShName());
				// 本地库
				if (isLocal == 0) {
					// 减少库存
					shProductMapper.updateshProductBeanForCount(productCode,
							subShId, -count, productSize);
					shopOrderBean.setStorePlace(subShId);
				} else {
					productNoLocalMapper.updateProductCount(productCode + "+"
							+ productSize, -count, shId);
					shopOrderBean.setStorePlace(storeHouseBean.getShName());
				}
				shopOrderMapper.saveShopOrder(shopOrderBean);
			}
		}
	}

	private String matchShopOrder(ShopOrderBean shopOrderBean) {
		JSONObject json = new JSONObject();
		Integer count = shopOrderBean.getCount();
		if (count != null && count > 0) {
			String productCode = shopOrderBean.getProductCode();
			String size = shopOrderBean.getSize();
			List<ShProductBean> shProlist = shProductMapper.getShProductBean(
					productCode, size, null);
			Map<String, List<ShProductBean>> map = dealData(shProlist);
			ShProductBean shProductBean = getShProductBean(map,
					shopOrderBean.getCount());
			if (shProductBean != null) {
				int reCount = shProductMapper.updateshProductBeanForCount(
						productCode, shProductBean.getShSubId(), count, size);
				if (reCount == 1) {
					shopOrderBean.setStorePlace(shProductBean.getShSubId());
					shopOrderBean.setIsLocal(0);
					shopOrderBean.setState("1");
					shopOrderBean.setIsHaveProductFlag("1");
					try {
						shopOrderMapper.saveShopOrder(shopOrderBean);
						json.put("success", true);
						json.put("status", "200");
						json.put("mess", "添加成功！");
					} catch (Exception e) {
						shProductMapper.updateshProductBeanForCount(
								productCode, shProductBean.getShSubId(),
								-count, size);
						json.put("success", true);
						json.put("status", "500");
						json.put("mess", "系统繁忙！添加订单失败");
					}
				}

			} else {
				ProductNolocalBean productBean = productNoLocalMapper
						.getProductNolocalDesc(productCode + "-" + size, null);
				if (productBean != null) {
					long totalCount = productBean.getTotalCount();
					if (totalCount >= count) {
						int res = productNoLocalMapper.updateProductCount(
								productCode + "-" + size, -(long) count,
								productBean.getShStoreId());
						if (res == 1) {
							StoreHouseBean storeHouse = storeHouseMapper
									.getStoreHouseBeanById(productBean
											.getShStoreId());
							shopOrderBean.setIsHaveProductFlag("1");
							shopOrderBean.setState("1");
							shopOrderBean.setIsLocal(2);
							shopOrderBean.setStorePlace(storeHouse.getShName());
							try {
								shopOrderMapper.saveShopOrder(shopOrderBean);
								json.put("success", true);
								json.put("status", "200");
								json.put("mess", "添加成功！");
							} catch (Exception e) {
								productNoLocalMapper.updateProductCount(
										productCode + "-" + size, (long) count,
										productBean.getShStoreId());
								json.put("success", true);
								json.put("status", "500");
								json.put("mess", "系统繁忙！添加订单失败");
							}
						}
					}
				} else {
					shopOrderBean.setIsHaveProductFlag("2");
					shopOrderBean.setState("2");
					shopOrderMapper.saveShopOrder(shopOrderBean);
					json.put("success", true);
					json.put("status", "200");
					json.put("mess", "添加成功！");
				}

			}
		} else {
			shopOrderBean.setState("2");
			shopOrderMapper.saveShopOrder(shopOrderBean);
		}
		return json.toString();
	}

	private String[] getShopLevel(Set<String> shopSet) {
		String[] shops = new String[shopSet.size()];
		shopSet.toArray(shops);
		List<Callable<ShopBean>> partitions = new ArrayList<Callable<ShopBean>>();
		for (final String shopName : shopSet) {
			partitions.add(new Callable<ShopBean>() {

				@Override
				public ShopBean call() throws Exception {
					String shopId = MD5Utils.MD5(shopName);
					ShopBean bean = shopMapper.getShopDesc(shopId);
					return bean;
				}
			});
		}
		int numberOfCores = Runtime.getRuntime().availableProcessors();
		ExecutorService executorPool = Executors
				.newFixedThreadPool(2 * numberOfCores);
		try {
			List<Future<ShopBean>> list = executorPool.invokeAll(partitions);
			executorPool.shutdown();
			int j = shopSet.size();
			String patternStr = "^[0-9]+$";
			for (int i = 0; i < j - 1; i++) {
				ShopBean bean1 = list.get(i).get();
				ShopBean bean2 = list.get(i + 1).get();
				if (bean1 == null) {
					String shopname = shops[i];
					shops[i--] = shops[--j];
					shops[j] = shopname;
				} else if (bean2 == null) {
					String shopname = shops[i];
					shops[i + 1] = shops[--j];
					shops[j] = shopname;
				} else {
					String leave1 = bean1.getPrivilegeLevel();
					String leave2 = bean2.getPrivilegeLevel();
					if (leave1 == null || !Pattern.matches(patternStr, leave1)) {
						String shopname = shops[i];
						shops[i--] = shops[--j];
						shops[j] = shopname;
					}
					if (leave2 == null || !Pattern.matches(patternStr, leave2)) {
						String shopname = shops[i];
						shops[i + 1] = shops[--j];
						shops[j] = shopname;
					} else {
						int leaveNum1 = Integer.parseInt(leave1);
						int leaveNum2 = Integer.parseInt(leave2);
						if (leaveNum1 > leaveNum2) {
							String shopname = shops[i];
							shops[i] = shops[i + 1];
							shops[i + 1] = shopname;
						}
					}
				}
			}
		} catch (Exception e) {
			return null;
		}
		return shops;
	}

	private JSONObject matchAndReduceStoreCount(ShopOrderBean shopOrderBean) {
		JSONObject json = new JSONObject();
		int isLocalNum = shopOrderBean.getIsLocal();
		String storePlace = shopOrderBean.getStorePlace();
		String productCode = shopOrderBean.getProductCode();
		String size = shopOrderBean.getSize();
		int countNum = shopOrderBean.getCount();

		if (isLocalNum == 0) {
			if (storePlace != null || "".equals(storePlace)) {
				List<ShProductBean> beanList = shProductMapper
						.getShProductBean(productCode, size, storePlace);
				if (beanList != null && !beanList.isEmpty()) {
					ShProductBean bean = beanList.get(0);
					int tempCount = bean.getCount();
					if (tempCount >= countNum) {
						shProductMapper
								.updateshProductBeanForCount(productCode,
										bean.getShSubId(), -countNum, size);

						json.put("success", true);
						json.put("status", "200");
						json.put("mess", "更新库存成功");

					} else {
						json.put("success", true);
						json.put("status", "500");
						json.put("mess", "库存不足");
					}
				} else {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "没有查到库存信息");
				}
			} else {
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "本地仓库时 仓库不能为空");
			}

		} else {
			storePlace = MD5Utils.MD5(storePlace);
			ProductNolocalBean bean = productNoLocalMapper
					.getProductNolocalDesc(productCode + "+" + size, storePlace);
			if (bean != null) {
				long totalCount = bean.getTotalCount();
				if (totalCount >= countNum) {
					productNoLocalMapper.updateProductCount(productCode + "+"
							+ size, -(long) countNum, storePlace);
					json.put("success", true);
					json.put("status", "200");
					json.put("mess", "更新库存成功");
				} else {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "库存不足");
				}
			} else {
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "库存地址不存在");
			}
		}

		return json;
	}

	private JSONObject restoreStoreCount(ShopOrderBean shopOrderBean) {
		JSONObject json = new JSONObject();
		int isLocal = shopOrderBean.getIsLocal();
		int res = 0;
		if (isLocal == 0) {
			res = shProductMapper.updateshProductBeanForCount(
					shopOrderBean.getProductCode(),
					shopOrderBean.getStorePlace(), shopOrderBean.getCount(),
					shopOrderBean.getSize());
		} else {
			res = productNoLocalMapper.updateProductCount(
					shopOrderBean.getProductCode() + "+"
							+ shopOrderBean.getSize(),
					(long) shopOrderBean.getCount(),
					MD5Utils.MD5(shopOrderBean.getStorePlace()));
		}
		if (res == 1) {
			json.put("success", true);
			json.put("status", "200");
			json.put("mess", "还原库存成功");
		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "系统繁忙！还原更新库存失敗");
		}
		return json;
	}

	private JSONObject checkUploadData(Sheet ws,
			Map<String, Integer> ralstionShip) {
		JSONObject json = new JSONObject();
		json = checkNullColumn(ralstionShip, columnNameMap);
		String resStatus = json.getString("status");
		if ("200".equals(resStatus)) {
			int rowNum = ws.getLastRowNum() + 1;
			for (int i = 1; i < rowNum; i++) {
				Row row = ws.getRow(i);
				String value = getCellValue(row, ralstionShip, "shopName");
				if (value == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess",
							"第" + (i + 1) + "行"
									+ (ralstionShip.get("shopName") + 1)
									+ "列的店铺名称不能为空");
					break;
				}
				value = getCellValue(row, ralstionShip, "productCode");
				if (value == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put(
							"mess",
							"第" + (i + 1) + "行"
									+ (ralstionShip.get("productCode") + 1)
									+ "列的商品编码不能为空");
					break;
				}
				value = getCellValue(row, ralstionShip, "orderCode");
				if (value == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put(
							"mess",
							"第" + (i + 1) + "行"
									+ (ralstionShip.get("orderCode") + 1)
									+ "列的订单编号不能为空");
					break;
				}
				value = getCellValue(row, ralstionShip, "orderId");
				if (value == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess",
							"第" + (i + 1) + "行"
									+ (ralstionShip.get("orderId") + 1)
									+ "列的订单号不能为空");
					break;
				}
				value = getCellValue(row, ralstionShip, "count");
				if (value == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess",
							"第" + (i + 1) + "行"
									+ (ralstionShip.get("count") + 1)
									+ "列的数量不能为空");
					break;
				} else {
					String patternStr = "^[1-9][0-9]{0,5}$";
					if (!Pattern.matches(patternStr, value)) {
						json.put("success", true);
						json.put("status", "500");
						json.put(
								"mess",
								"第" + (i + 1) + "行"
										+ (ralstionShip.get("count") + 1)
										+ "列的数量必须为六位以内大于0数字不能为空");
					}
				}
			}
		}

		return json;
	}

	private JSONObject checkNullColumn(Map<String, Integer> ralstionShip,
			Map<String, String> columnNameMap) {
		JSONObject json = new JSONObject();
		json.put("success", true);
		json.put("status", "200");

		if (columnNameMap != null && !columnNameMap.isEmpty()) {
			for (String key : columnNameMap.keySet()) {
				Integer index = ralstionShip.get(key);
				if (index == null) {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "缺少" + columnNameMap.get(key) + "列");
					break;
				}
			}
		}

		return json;
	}
}
