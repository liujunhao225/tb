/**
 * 采购商品操作
 */
package com.oscar.oscar.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ProductInfoBean;
import com.oscar.oscar.bean.ProductNolocalBean;
import com.oscar.oscar.bean.PurchaseOrderBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.bean.SupplierBean;
import com.oscar.oscar.service.ProductInfoMapper;
import com.oscar.oscar.service.ProductNolocalMapper;
import com.oscar.oscar.service.PurchaseOrderMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.StoreHouseMapper;
import com.oscar.oscar.service.SupplierMapper;

@RequestMapping("/product")
@Component
@Controller
public class ProductInfoAction {

	@Autowired
	private ProductInfoMapper productInfoMapper;
	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private StoreHouseMapper storeHouseMapper;
	@Autowired
	private ProductNolocalMapper productNoLocalMapper;
	@Autowired
	PurchaseOrderMapper purchaseOrderMapper;
	@Autowired
	private SupplierMapper supplierMapper;

	@RequestMapping("/index")
	public String index() {
		return "/product/product";
	}

	@RequestMapping("/list.do")
	@ResponseBody
	public String getList(HttpServletRequest request) {
		String productId = request.getParameter("productId");
		String productSize = request.getParameter("productSize");
		String productName = request.getParameter("productName");
		String productCode = request.getParameter("productCode");
		ProductInfoBean productbean = new ProductInfoBean();
		productbean.setProductId(productId);
		productbean.setProductSize(productSize);
		productbean.setProductName(productName);
		productbean.setProductCode(productCode);
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 20;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 20;
		}
		List<ProductInfoBean> list = productInfoMapper.getProductList(
				productbean, new RowBounds(startNum, limitNum));
		int count = productInfoMapper.getProductListCount(productbean);
		JSONObject job = new JSONObject();
		job.put("datalist", list);
		job.put("totalRecords", count);
		System.out.println(job.toString());
		return job.toString();

	}

	@RequestMapping("/add.do")
	@ResponseBody
	public String add(HttpServletRequest request) {
		String productId = request.getParameter("productId");
		String productCode = request.getParameter("productCode");
		String productSize = request.getParameter("productSize");
		String productName = request.getParameter("productName");
		String barCode = request.getParameter("barCode");
		String color = request.getParameter("color");
		String brand = request.getParameter("brand");
		String season = request.getParameter("season");
		String ingrowth = request.getParameter("ingrowth");
		JSONObject job = new JSONObject();
		ProductInfoBean bean = productInfoMapper.getProductInfoByBarCode(barCode);
		if(bean == null)
		{
			bean = productInfoMapper.getProductInfoByCodeAndSize(productId, productSize);
			if(bean == null)
			{
				bean = new ProductInfoBean();
				bean.setProductId(productId);
				bean.setProductCode(productCode);
				bean.setProductSize(productSize);
				bean.setProductName(productName);
				bean.setBarCode(barCode);
				bean.setColor(color);
				bean.setBrand(brand);
				bean.setSeason(season);
				bean.setIngrowth(ingrowth);

				int result = productInfoMapper.addproduct(bean);

				if (result == 1) {
					job.put("success", true);
				}
				else
				{
					job.put("success", false);	
				}	
			}
			else
			{
				job.put("success", true);	
				job.put("recode", 1);
				job.put("desc", "货号和尺码必须唯一，新增商品失败！");	
			}
			
		}
		else
		{
			job.put("success", true);	
			job.put("recode", 1);
			job.put("desc", "条形码重复,新增商品失败！");	
		}
		return job.toString();	
	}

	@RequestMapping("/update.do")
	@ResponseBody
	public String edit(HttpServletRequest request) {
		String id = request.getParameter("id");
		String productId = request.getParameter("productId");
		String productCode = request.getParameter("productCode");
		String productSize = request.getParameter("productSize");
		String productName = request.getParameter("productName");
		String barCode = request.getParameter("barCode");
		String color = request.getParameter("color");
		String brand = request.getParameter("brand");
		String season = request.getParameter("season");
		String ingrowth = request.getParameter("ingrowth");
		long idnum = Long.parseLong(id);
		JSONObject job = new JSONObject();
		ProductInfoBean bean = productInfoMapper.getProductInfoByBarCode(barCode);
		if(bean == null||idnum == bean.getId())
		{
			bean = productInfoMapper.getProductInfoByCodeAndSize(productId, productSize);
			if(bean == null||idnum == bean.getId())
			{
				bean = new ProductInfoBean();
				bean.setId(idnum);
				bean.setProductId(productId);
				bean.setProductCode(productCode);
				bean.setProductSize(productSize);
				bean.setProductName(productName);
				bean.setBarCode(barCode);
				bean.setColor(color);
				bean.setBrand(brand);
				bean.setSeason(season);
				bean.setIngrowth(ingrowth);

				int result = productInfoMapper.updateProductInfo(bean);

				if (result == 1) {
					job.put("success", true);
				}
				else
				{
					job.put("success", false);	
				}	
			}
			else
			{
				job.put("success", true);	
				job.put("recode", 1);
				job.put("desc", "货号和尺码必须唯一，修改商品失败！");	
			}
			
		}
		else
		{
			job.put("success", true);	
			job.put("recode", 1);
			job.put("desc", "条形码重复,修改商品失败！");	
		}
		return job.toString();	
	}

	@RequestMapping("/delete.do")
	@ResponseBody
	public String delete(HttpServletRequest request) {
		String id = request.getParameter("id");
		long idnum = Long.parseLong(id);
		ProductInfoBean bean = new ProductInfoBean();
		bean.setId(idnum);
		int result = productInfoMapper.deleteProductInfo(bean);
		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", true);
		return job.toString();
	}
	
	@RequestMapping("/getProductStoreList.do")
	@ResponseBody
	public String getProductStoreList(HttpServletRequest request) {
		String id = request.getParameter("id");
		String shName = request.getParameter("shName");
		String shSubId = request.getParameter("shSubId");
		String type = request.getParameter("type");
		if(type == null)
		{
			type = "2";	
		}
		long idnum = Long.parseLong(id);
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 20;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 20;
		}
		ProductInfoBean bean = productInfoMapper.getProductInfoById(idnum);
		JSONObject job = new JSONObject();
		if(bean != null)
		{
			String productId = bean.getProductId();
			String size = bean.getProductSize();
			if("2".equals(type))
			{
				List<ShProductBean> shProductList = shProductMapper.getShProductBeanList(productId, size,shName,shSubId, new RowBounds(startNum, limitNum));
				int totalCount = shProductMapper.getShProductBeanCount(productId, size,shName,shSubId);
				if(shProductList != null&&!shProductList.isEmpty())
				{
					JSONArray dataList = new JSONArray();
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					for (ShProductBean shProductBean : shProductList) {
						String shId = shProductBean.getShId();
						StoreHouseBean storeHouse = storeHouseMapper.getStoreHouseBeanById(shId);
						JSONObject data = new JSONObject();
						data.put("shName", storeHouse.getShName());
						data.put("shSubId", shProductBean.getShSubId());
						data.put("count", shProductBean.getCount());
						data.put("state", shProductBean.getState());
						Date date = shProductBean.getTime();
						if(date != null)
						{
							data.put("time", sdf.format(date));	
						}
						dataList.put(data);
					}
					job.put("datalist", dataList);
					job.put("totalRecords", totalCount);	
				}
			}
			else
			{
				List<ProductNolocalBean> list = productNoLocalMapper.getProductNolocalList(productId+"-"+size, shName, new RowBounds(startNum, limitNum));
				int totalCount = productNoLocalMapper.getProductNolocalCount(productId+"-"+size, shName);
				if(list != null&&!list.isEmpty())
				{
					JSONArray dataList = new JSONArray();
					for (ProductNolocalBean productNolocalBean : list) {

						String shId = productNolocalBean.getShStoreId();
						StoreHouseBean storeHouse = storeHouseMapper.getStoreHouseBeanById(shId);
						JSONObject data = new JSONObject();
						data.put("shName", storeHouse.getShName());
						data.put("count", productNolocalBean.getTotalCount());
						data.put("price", productNolocalBean.getPrice());
						dataList.put(data);
					}
					job.put("datalist", dataList);
					job.put("totalRecords", totalCount);	
				}
			}
		}
		System.out.println(job.toString());
		return job.toString();
	}
	
	@RequestMapping("/proPuchOrderlist.do")
	@ResponseBody
	public String proPuchOrderList(HttpServletRequest request) {
		String id = request.getParameter("id");
		String orderId = request.getParameter("orderId");
		long idnum = Long.parseLong(id);
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 20;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 20;
		}
		List<PurchaseOrderBean> list =purchaseOrderMapper.getOrderListByProductId(idnum, orderId, new RowBounds(startNum, limitNum));
		int count = purchaseOrderMapper.getOrderListCountByProductId(idnum, orderId);
		JSONObject job = new JSONObject();
		if(list !=null &&!list.isEmpty())
		{
			
			JSONArray dataList = new JSONArray();
			for (PurchaseOrderBean purchaseOrderBean : list) {
				String supplierId =  purchaseOrderBean.getSupplierId();
				SupplierBean supplier = supplierMapper.getSupplierById(supplierId);
				JSONObject data = new JSONObject();
				data.put("orderId", purchaseOrderBean.getOrderId());
				data.put("supplierName", supplier.getSupplierName());
				data.put("purchaseDate", purchaseOrderBean.getPurchaseDate());
				data.put("orderState", purchaseOrderBean.getOrderState());
				data.put("arriveDate", purchaseOrderBean.getArriveDate());
				dataList.put(data);
			}
			job.put("datalist", dataList);
			job.put("totalRecords", count);
		}
		System.out.println(job.toString());
		return job.toString();
	}

}
