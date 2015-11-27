package com.oscar.oscar.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import com.oscar.oscar.bean.ProductInfoBean;

/**
 * excel转化成ProductInfo
 * @author mayibo
 *
 */
public class ExcelToProductInfoTool {

	private static Logger log = Logger.getLogger(ExcelToProductInfoTool.class);
	private static HashMap<String, Integer> headerMap = new HashMap<String, Integer>();
	static {
		headerMap.put("编码", 20);
		headerMap.put("货号", 20);
		headerMap.put("尺码", 20);
		headerMap.put("货名", 20);
		headerMap.put("颜色", 20);
		headerMap.put("品牌", 20);
		headerMap.put("季节", 20);
		headerMap.put("內长", 20);
		headerMap.put("种类", 20);
	}
	public List<ProductInfoBean> convertToProductInfo(String filepath) {

		File file = new File(filepath);
		FileInputStream fis = null;
		XSSFWorkbook wb = null;
		List<ProductInfoBean> list = null;
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
			list = new ArrayList<ProductInfoBean>();
			for (int i = 1; i < rowNum; i++) {
				XSSFRow row = ws.getRow(i);
				ProductInfoBean pro = makeBean(row);
				if (pro != null) {
						list.add(pro);
				} else {
					log.error("文件名：" + filepath + "第" + (i + 2) + "行数据有问题");
				}
			}
			//observer use
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

	private ProductInfoBean makeBean(XSSFRow row) {
		ProductInfoBean pro = null;
		try {
			pro = new ProductInfoBean();
			// 取得货号的
			Cell productCodeCell = row.getCell(headerMap.get("编码"));
			pro.setProductCode(getCellValue(productCodeCell));

			// 取得货号
			Cell productIdCell = row.getCell(headerMap.get("货号"));
			pro.setProductId(getCellValue(productIdCell));
			// get size
			Cell sizeCell = row.getCell(headerMap.get("尺码"));
			pro.setProductSize(getCellValue(sizeCell));
			
			//get product name
			Cell productNameCell= row.getCell(headerMap.get("货名"));
			pro.setProductName(getCellValue(productNameCell));
			
			//get color
			Cell colorCell =row.getCell(headerMap.get("颜色"));
			pro.setColor(getCellValue(colorCell));
			//get season 
			Cell seasonCell =row.getCell(headerMap.get("季节"));
			pro.setSeason(getCellValue(seasonCell));
			//get inner length
			Cell innerLengthCell =row.getCell(headerMap.get("內长"));
			pro.setIngrowth(getCellValue(innerLengthCell));
			//get kind
			Cell kindCell =row.getCell(headerMap.get("种类"));
			pro.setKind(getCellValue(kindCell));
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
