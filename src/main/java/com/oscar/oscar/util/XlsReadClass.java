package com.oscar.oscar.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class XlsReadClass {

	public static void main(String[] args) {
		// FIXME 测试前改为自己的文件
		readXls("d:\\6.11-1-杰之行需求.xlsx");
	}

	private static void readXls(String filePath) {

		File excel = new File(filePath);
		FileInputStream fis = null;
		XSSFWorkbook wb = null;
		try {
			fis = new FileInputStream(excel);
			wb = new XSSFWorkbook(fis);
			XSSFSheet ws = wb.getSheetAt(0);

			int columnNum = ws.getRow(0).getLastCellNum();// 总列数
			int rowNum = ws.getLastRowNum() + 1;// 总行数

			for (int i = 0; i < rowNum; i++) {
				XSSFRow row = ws.getRow(i);
				StringBuffer stringBuffer = new StringBuffer();
				for (int j = 0; j < columnNum; j++) {
					Cell tempCell = row.getCell(j);
					if (tempCell == null) {
						continue;
					}
					int cellType = tempCell.getCellType();
					switch (cellType) {
					case Cell.CELL_TYPE_BLANK:
						stringBuffer.append("null,");
						break;
					case Cell.CELL_TYPE_BOOLEAN:
						stringBuffer.append(tempCell.getBooleanCellValue()
								+ ",");
						System.out.println();
						break;
					case Cell.CELL_TYPE_NUMERIC:
						stringBuffer.append(tempCell.getNumericCellValue()
								+ ",");
						break;
					case Cell.CELL_TYPE_STRING:
						stringBuffer
								.append(tempCell.getStringCellValue() + ",");
						break;
					default:
						stringBuffer.append("null,");
						break;
					}
				}
				System.out.println(stringBuffer.toString());
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				wb.close();
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}
