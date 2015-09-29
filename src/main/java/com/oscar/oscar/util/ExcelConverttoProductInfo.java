package com.oscar.oscar.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.JSONObject;

import com.oscar.oscar.bean.ProductInfoBean;
import com.oscar.oscar.bean.PurchaseExcelAnalysisBean;
import com.oscar.oscar.bean.PurchaseOrderBean;
import com.oscar.oscar.bean.PurchaseOrderProductBean;
import com.oscar.oscar.bean.PurchaseProductInfoObject;

/**
 * 不支付excel 2007 以下的版本
 * 
 * @author Administrator
 *
 */
public class ExcelConverttoProductInfo {

	private static Logger log = Logger
			.getLogger(ExcelConverttoProductInfo.class);
	private static HashMap<String, Integer> headerMap = new HashMap<String, Integer>();

	private static int MAX_COLUMN_INDEX = 20;
	static {
		headerMap.put("条码", MAX_COLUMN_INDEX);
		headerMap.put("编码", MAX_COLUMN_INDEX);
		headerMap.put("货号", MAX_COLUMN_INDEX);
		headerMap.put("尺码", MAX_COLUMN_INDEX);
		headerMap.put("进价", MAX_COLUMN_INDEX);
		headerMap.put("牌价", MAX_COLUMN_INDEX);
		headerMap.put("总金额", MAX_COLUMN_INDEX);
		headerMap.put("类别", MAX_COLUMN_INDEX);
		headerMap.put("名称", MAX_COLUMN_INDEX);
		headerMap.put("数量", MAX_COLUMN_INDEX);
	}

	public PurchaseExcelAnalysisBean convertToProductInfo(String filepath) {
		File file = new File(filepath);
		FileInputStream fis = null;
		// HSSFWorkbook
		Workbook wb = null;
		PurchaseExcelAnalysisBean analysisBean = new PurchaseExcelAnalysisBean();
		List<PurchaseOrderProductBean> list = null;
		List<String> errorList = new ArrayList<String>();
		try {
			fis = new FileInputStream(file);

			try {
				wb = WorkbookFactory.create(fis);
			} catch (Exception e) {
				log.error("【解析采购单】采购单和格式不正确！");
				return new PurchaseExcelAnalysisBean();
			}
			Sheet ws = wb.getSheetAt(0);

			int columnNum = ws.getRow(0).getLastCellNum();// 总列数

			int rowNum = ws.getLastRowNum() + 1;// 总行数
			// 匹配第一行
			Row row1 = ws.getRow(0);
			Map<String, Integer> map = getHeaderMap();
			for (int j = 0; j < columnNum; j++) {
				Cell tempCell = row1.getCell(j);
				if (map.containsKey(tempCell.getStringCellValue())) {
					headerMap.put(tempCell.getStringCellValue(), j);
				}
			}
			list = new ArrayList<PurchaseOrderProductBean>();
			Map<String, Object> checkExistedMap = new HashMap<String, Object>();

			for (int i = 1; i < rowNum; i++) {
				Row row = ws.getRow(i);
				PurchaseProductInfoObject pro = makeBean(row);

				if (!"".equals(pro.getKey()) && pro.getBean() != null) {
					if (checkExistedMap.containsKey(pro.getKey())) {
						errorList.add("文件：" + filepath + "第" + (i + 1)
								+ "商品号在采购单中已存在！");
					} else {
						checkExistedMap.put(pro.getKey(), pro.getBean());
						list.add((PurchaseOrderProductBean) pro.getBean());
					}
				} else {
					errorList.add("文件：" + filepath + "第" + (i + 1) + "行数据有问题！");
					log.error("文件：" + filepath + "第" + (i + 1) + "行数据有问题！");
				}
			}
			JSONObject job = new JSONObject();
			job.put("list", list);
			System.out.println(job.toString());
			analysisBean.setErrorLine(errorList);
			analysisBean.setProductInfoList(list);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if(wb !=null){
					wb.close();
				}
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return analysisBean;
	}

	private PurchaseProductInfoObject makeBean(Row row) {
		PurchaseProductInfoObject purchaseProductInfoObject = new PurchaseProductInfoObject();
		String key = "";
		PurchaseOrderProductBean pro = null;
		try {

			pro = new PurchaseOrderProductBean();
			ProductInfoBean productInfoBean = new ProductInfoBean();
			pro.setProductInfoBean(productInfoBean);

			// 取得条码
			Cell barcodeCodeCell = row.getCell(headerMap.get("条码"));
			pro.getProductInfoBean().setBarCode(getCellValue(barcodeCodeCell));
			// 取得货号
			Cell productIdCell = row.getCell(headerMap.get("货号"));
			String productId = getCellValue(productIdCell);
			pro.getProductInfoBean().setProductId(productId);
			// 取得尺码
			Cell sizeCell = row.getCell(headerMap.get("尺码"));
			String productSize = getCellValue(sizeCell);
			pro.getProductInfoBean().setProductSize(productSize);

			// 取得编码
			if (headerMap.get("编码") == MAX_COLUMN_INDEX) {
				key = productId + productSize;
			} else {
				Cell productCodeCell = row.getCell(headerMap.get("编码"));
				key = getCellValue(productCodeCell);
			}
			pro.getProductInfoBean().setProductCode(key);

			// 取得类别
			Cell kindCell = row.getCell(headerMap.get("类别"));
			pro.getProductInfoBean().setKind(getCellValue(kindCell));

			// 取得名称
			Cell productNameCell = row.getCell(headerMap.get("名称"));
			pro.getProductInfoBean().setProductName(
					getCellValue(productNameCell));

			PurchaseOrderBean purchaseOrderBean = new PurchaseOrderBean();
			pro.setPurchaseOrderBean(purchaseOrderBean);
			// 取得进价
			Cell priceCell = row.getCell(headerMap.get("进价"));
			pro.setPrice(getCellValue(priceCell));
			// 取得牌价
			Cell sellPriceCell = row.getCell(headerMap.get("牌价"));
			pro.setSellsPrice(getCellValue(sellPriceCell));
			// 取得总金额
			Cell totalMoneyCell = row.getCell(headerMap.get("总金额"));
			pro.setAllPrice(getCellValue(totalMoneyCell));
			// 取得数量
			Cell countCell = row.getCell(headerMap.get("数量"));
			String countString = getCellValue(countCell);
			if (countString.contains(".")) {
				countString = countString
						.substring(0, countString.indexOf("."));
			}

			pro.setPurchaseNum(Integer.parseInt(countString));
		} catch (Exception e) {
			pro = null;
			e.printStackTrace();
		}
		purchaseProductInfoObject.put(key, pro);
		return purchaseProductInfoObject;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Integer> getHeaderMap() {
		return (Map<String, Integer>) headerMap.clone();
	}

	public static void main(String[] args) {
		File file = new File("F:\\TB\\实物进销存\\DJT0010883装箱单.xlsx");
		System.out.println(file.exists());
//		ExcelConverttoProductInfo excel = new ExcelConverttoProductInfo();
		// excel.convertToProductInfo(file);
	}

	public String getCellValue(Cell cell) {
		if (cell == null) {
			return "";
		}
		cell.setCellType(HSSFCell.CELL_TYPE_STRING);
		String cellValue = "";
		int cellType = cell.getCellType();
		switch (cellType) {
		case Cell.CELL_TYPE_BLANK:
			cellValue = "";
			break;
		case Cell.CELL_TYPE_NUMERIC:
			cellValue = String.valueOf(cell.getNumericCellValue());
			break;
		case Cell.CELL_TYPE_STRING:
			cellValue = cell.getStringCellValue();
			break;
		default:
			cellValue = "";
			break;
		}
		return cellValue;
	}

}
