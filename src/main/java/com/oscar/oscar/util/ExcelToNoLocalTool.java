package com.oscar.oscar.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import com.oscar.oscar.bean.ProductNolocalBean;

public class ExcelToNoLocalTool {
	private static Logger log = Logger.getLogger(ExcelToNoLocalTool.class);
	private static HashMap<String, Integer> headerMap = new HashMap<String, Integer>();
	static {
		headerMap.put("编码", 20);
		headerMap.put("价格", 20);
		headerMap.put("数量", 20);
		headerMap.put("仓库", 20);
	}
	public List<ProductNolocalBean> convertToProductInfo(String filepath) {

		File file = new File(filepath);
		FileInputStream fis = null;
		XSSFWorkbook wb = null;
		List<ProductNolocalBean> list = null;
		try {
			fis = new FileInputStream(file);
			wb = new XSSFWorkbook(fis);
			XSSFSheet ws = wb.getSheetAt(0);

			int columnNum = ws.getRow(0).getLastCellNum();// 总列数
			int rowNum = ws.getLastRowNum() + 1;// 总行数

			// 匹配第一行
			XSSFRow row1 = ws.getRow(0);
			Map<String, Integer> map = getHeaderMap();
			for (int j = 0; j < columnNum; j++) {
				Cell tempCell = row1.getCell(j);
				if (map.containsKey(tempCell.getStringCellValue())) {
					headerMap.put(tempCell.getStringCellValue(), j);
				}
			}
			list = new ArrayList<ProductNolocalBean>();
			Set<String> productSet = new HashSet<String>();
			for (int i = 1; i < rowNum; i++) {
				XSSFRow row = ws.getRow(i);
				ProductNolocalBean pro = makeBean(row);
				if (pro != null) {
					if (!productSet.contains(pro.toHashCode())) {
						productSet.add(pro.toHashCode());
						list.add(pro);
					}
				} else {
					log.error("文件名：" + filepath + "第" + (i + 2) + "行数据有问题");
				}
			}
			JSONObject job = new JSONObject();
			job.put("list", list);
			System.out.println(job.toString());
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				wb.close();
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return list;
	}

	private ProductNolocalBean makeBean(XSSFRow row) {
		ProductNolocalBean pro = null;
		try {
			pro = new ProductNolocalBean();
			// 取得货号的
			Cell productIdCell = row.getCell(headerMap.get("编码"));
			pro.setProductId(getCellValue(productIdCell));

			// 取得条码
			Cell priceCell = row.getCell(headerMap.get("价格"));
			pro.setPrice(getCellValue(priceCell));
			// 取得数量
			Cell countCell = row.getCell(headerMap.get("数量"));
			String countString = getCellValue(countCell);
			if (countString.contains(".")) {
				countString = countString
						.substring(0, countString.indexOf("."));
			}
			pro.setTotalCount(Long.valueOf(countString));
			
			Cell storeHouseCell = row.getCell(headerMap.get("仓库"));
			String shId = MD5Utils.MD5(getCellValue(storeHouseCell));
			pro.setShStoreId(shId);
		} catch (Exception e) {
			pro = null;
			e.printStackTrace();
		}
		return pro;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Integer> getHeaderMap() {
		return (Map<String, Integer>) headerMap.clone();
	}

	public String getCellValue(Cell cell) {
		if (cell == null) {
			return "";
		}
		String cellValue = "";
		int cellType = cell.getCellType();
		switch (cellType) {
		case Cell.CELL_TYPE_BLANK:
			cellValue = "";
			break;
		case Cell.CELL_TYPE_NUMERIC:
			cellValue = String.valueOf(cell.getNumericCellValue()).trim();
			break;
		case Cell.CELL_TYPE_STRING:
			cellValue = cell.getStringCellValue().trim();
			break;
		default:
			cellValue = "";
			break;
		}
		return cellValue;
	}

}
