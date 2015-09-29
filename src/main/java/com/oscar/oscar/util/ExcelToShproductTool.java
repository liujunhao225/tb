/**
 * 将excel中的记录转换为shProduct
 */

package com.oscar.oscar.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import com.oscar.oscar.bean.ShProductBean;

public class ExcelToShproductTool {
	private static Logger log = Logger.getLogger(ExcelToShproductTool.class);
	private static HashMap<String, Integer> headerMap = new HashMap<String, Integer>();
	static {
		headerMap.put("货号", 20);
		headerMap.put("尺码", 20);
		headerMap.put("编码", 20);
		headerMap.put("数量", 20);
		headerMap.put("仓库", 20);
		headerMap.put("仓位", 20);
		headerMap.put("日期", 20);
	}

	public List<ShProductBean> convertToProductInfo(String filepath) {

		File file = new File(filepath);
		FileInputStream fis = null;
		XSSFWorkbook wb = null;
		List<ShProductBean> list = null;
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
				if(tempCell ==null)
				{
					break;
				}
				if (map.containsKey(tempCell.getStringCellValue())) {
					headerMap.put(tempCell.getStringCellValue(), j);
				}
			}
			list = new ArrayList<ShProductBean>();
			Set<String> productSet = new HashSet<String>();
			for (int i = 1; i < rowNum; i++) {
				XSSFRow row = ws.getRow(i);
				ShProductBean pro = makeBean(row);
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

	private ShProductBean makeBean(XSSFRow row) {
		ShProductBean pro = null;
		try {
			pro = new ShProductBean();
			// 取得货号的
			Cell productIdCell = row.getCell(headerMap.get("货号"));

			pro.setProductId(getCellValue(productIdCell));

			Cell sizeCell = row.getCell(headerMap.get("尺码"));

			pro.setProductSize(getCellValue(sizeCell));
			
			Cell productCodeCell = row.getCell(headerMap.get("编码"));
			pro.setProductCode(getCellValue(productCodeCell));
			// 取得数量
			Cell countCell = row.getCell(headerMap.get("数量"));
			String countString = getCellValue(countCell);
			if (countString.contains(".")) {
				countString = countString
						.substring(0, countString.indexOf("."));
			}
			pro.setCount(Integer.valueOf(countString));
			// 仓库
			Cell storeHouseCell = row.getCell(headerMap.get("仓库"));
			String shId = MD5Utils.MD5(getCellValue(storeHouseCell));
			pro.setShId(shId);
			// 仓位
			Cell shSubCell = row.getCell(headerMap.get("仓位"));
			pro.setShSubId(getCellValue(shSubCell));

			// 日期
			Cell dateCell = row.getCell(headerMap.get("日期"));
			if (dateCell != null && DateUtil.isCellDateFormatted(dateCell)) {

				String dateString = new SimpleDateFormat("yyyy-MM-dd")
						.format(dateCell.getDateCellValue());
				System.out.println(dateString);
				pro.setTime(new SimpleDateFormat("yyyy-MM-dd")
						.parse(dateString));

			} else {
				pro.setTime(Calendar.getInstance().getTime());
			}
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
		cell.setCellType(Cell.CELL_TYPE_STRING);
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
