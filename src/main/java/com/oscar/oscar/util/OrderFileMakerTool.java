/**
 * Author:liujunhao
 * Date:2015-09-29
 * Note:生成下载文件，返回下载文件名
 */
package com.oscar.oscar.util;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.oscar.oscar.bean.ShopOrderBean;

public class OrderFileMakerTool {

	private static Logger logger = Logger.getLogger(OrderFileMakerTool.class
			.getCanonicalName());

	/**
	 * 
	 * @param fileName
	 *            @
	 * @return
	 */
	public static String makeExcel(String fileName,
			Map<String, ShopOrderBean> map) {

		logger.info("【导出文件】打开原始文件");
		Workbook workbook = null;
		try {
			workbook = new XSSFWorkbook(
					OPCPackage
							.open(SystemDictionary.FilePath.UPLOAD_FILE_ORDER_PATH
									+ fileName));
			Sheet sheet = workbook.getSheetAt(0);
			sheet.setDefaultRowHeight((short) 1000);
			int maxRowNum = sheet.getLastRowNum();
			// 取得订单编号的列索引
			int columnNum = sheet.getRow(0).getLastCellNum();
			int orderIdColumnIndex = 200;
			Row titleRow = sheet.getRow(0);
			for (int i = 0; i < columnNum; i++) {
				titleRow.getCell(i).setCellType(Cell.CELL_TYPE_STRING);
				String cellValue = titleRow.getCell(i).getStringCellValue();
				if ("订单编号" == cellValue) {
					orderIdColumnIndex = i;
					break;
				}
			}
			// 获取

			FileOutputStream fileOut = new FileOutputStream(
					SystemConfig.DOWNLOAD_FILE_PATH + fileName);
			workbook.write(fileOut);
			fileOut.close();
		} catch (InvalidFormatException e) {
			logger.error("【导出文件】excel文件格式 不正确");
			e.printStackTrace();
			return "";
		} catch (IOException e) {
			logger.error("【导出文件】excel文件IO异常");
			e.printStackTrace();
			return "";
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		} finally {
			// logger.info("【导出文件】关闭文件");
			// if (workbook != null)
			// try {
			// workbook.close();
			// } catch (IOException e) {
			// e.printStackTrace();
			// }
		}
		return SystemConfig.DOWNLOAD_FILE_PATH + fileName;// 返回excel路径
	}

	public static void main(String[] args) {
		System.out.println(makeExcel("测试抓图.xlsx"));
	}

	private static boolean checkRow(Row row) {
		try {
			row.getCell(0).getStringCellValue();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
