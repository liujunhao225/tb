/**
 * 外地库操作
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ProductNolocalBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ProductNolocalMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.StoreHouseMapper;
import com.oscar.oscar.util.ExcelToNoLocalTool;
import com.oscar.oscar.util.ExcelToShproductTool;
import com.oscar.oscar.util.FileSaveUtil;
import com.oscar.oscar.util.FileUploadBean;

@Controller
@Component
@RequestMapping("/specialstore")
public class SpecialStoreHouseAction {
	@Autowired
	private ProductNolocalMapper productNolocalMapper;

	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private StoreHouseMapper storeHouseMapper;

	@RequestMapping("/index")
	public String index() {
		return "/nolocal/nolocal";
	}

	@RequestMapping("/list")
	@ResponseBody
	public String list(HttpServletRequest request)  {
		try{
		String productId = request.getParameter("tproductId");
		String storeid = request.getParameter("tstorehouseid");
		String start = request.getParameter("startLine");
		if(start==null || start.length()<1){
			start = request.getParameter("page");
		}
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

		// 判断仓库类型
		StoreHouseBean storeBean = storeHouseMapper
				.getStoreHouseBeanById(storeid);
		String storeType = storeBean.getShType();
		// 本地库存
		JSONObject job = new JSONObject();
		if ("2".equals( storeType)) {
			ShProductBean bean = new ShProductBean();
			bean.setShId(storeid);
			List<ShProductBean> productList = shProductMapper.getallshproduct(
					bean, new RowBounds(startNum, limitNum));
			int count = shProductMapper.getallshproductCount(bean);
			List<JSONObject> joblist = new ArrayList<JSONObject>();
			for(ShProductBean sbean :productList){
				JSONObject tempjob= new JSONObject();
				tempjob.put("shStoreId", sbean.getShId());
				tempjob.put("productId",sbean.getProductCode());
				tempjob.put("totalCount", sbean.getCount());
				tempjob.put("inputTime", sbean.getTime());
				joblist.add(tempjob);
			}
			job.put("datalist", joblist);
			job.put("totalRecords", count);
			return job.toString();
		} else {
			// 外地库存
			List<ProductNolocalBean> list = productNolocalMapper.getList(
					productId,storeid, new RowBounds(startNum, limitNum));
			int count = productNolocalMapper.getListCount(productId,storeid);
			job.put("datalist", list);
			job.put("totalRecords", count);
			return job.toString();
		}
		}
		catch(Exception e){
			e.printStackTrace();
			return "";
		}
	}

	@RequestMapping("/upload")
	@ResponseBody
	public String upload(FileUploadBean filebean, HttpServletRequest request) {
		// 清空表中的内容
		// ProductNolocalBean shStoreBean =
		// productNolocalMapper.getNolocalBean(); // 获得外地仓

		// 导入方法分两种：增量式和全量式;增量式：办公室导入，取值为1;全最式：郑州本地导入（包括办公室和郑州大仓）;

		String method = request.getParameter("umethod");
		String storeType = request.getParameter("ustoreTypeId");

		String fileName = FileSaveUtil.save(filebean, "");// 保存文件

		int total = 0;
		// 外地库存导入
		if ("2".equals(method) && "2".equals(storeType)) {

			total = noLocalStoreInput(fileName);
		} else if ("1".equals(method) && "1".equals(storeType)) {
			// 增量式导入
			total = localStoreInputAdd(fileName);

		} else if ("2".equals(method) && "1".equals(storeType)) {
			// 全量式导入
			total = localStoreInputDeleteAndAdd(fileName);
		}
		JSONObject job = new JSONObject();
		if (total > 0) {
			job.put("success", true);
			job.put("total", total);
		} else {
			job.put("success", false);
			job.put("total", total);

		}
		return job.toString();
	}

	/**
	 * 外地库存删除后，全量导入
	 * 
	 * @param filePath
	 */
	private int noLocalStoreInput(String filePath) {
		try {
			productNolocalMapper.deleteAllRecord();
			ExcelToNoLocalTool converter = new ExcelToNoLocalTool();
			List<ProductNolocalBean> list = converter
					.convertToProductInfo(filePath);
			int total = list.size();
			productNolocalMapper.addnolocalBatch(list);
			return total;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	/**
	 * 针对办室导入
	 * 
	 * @param filePath
	 */
	private int localStoreInputAdd(String filePath) {
		List<ShProductBean> list = new ExcelToShproductTool()
				.convertToProductInfo(filePath);
		for (ShProductBean bean : list) {
			try {
				if (shProductMapper.getproductstorehouse(bean) == null) {
					shProductMapper.addtostorehouse(bean);
				} else {
					// ,@Param(value="productSize")String productSize
					shProductMapper.updateshProductBeanForCount(
							bean.getProductId(), bean.getShSubId(),
							bean.getCount(), "");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return list.size();
	}

	/**
	 * 全量导入
	 */
	private int localStoreInputDeleteAndAdd(String filePath) {
		try {
			shProductMapper.deleteAllRecord();// 删除
			ExcelToShproductTool tool = new ExcelToShproductTool();
			List<ShProductBean> list = tool.convertToProductInfo(filePath);
			// 批量导入
			shProductMapper.batchAdd(list);
			return list.size();
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	@RequestMapping("/clearStorage")
	@ResponseBody
	public String clearStorage() {
		productNolocalMapper.deleteAllRecord();
		return "";

	}
}
