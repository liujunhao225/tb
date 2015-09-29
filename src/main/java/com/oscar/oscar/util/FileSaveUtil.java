package com.oscar.oscar.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

public class FileSaveUtil {

	private static final String DEFAULT_PATH = "d:\\tb";

	private static Logger logger = Logger.getLogger(FileSaveUtil.class);

	/**
	 * 
	 * @param fileBean
	 *            文件类
	 * @param path
	 *            保存路径，为空时保存至默认路径
	 * @return
	 */
	public static String save(FileUploadBean fileBean, String path) {
		if (StringUtils.isEmpty(path)) {
			path = DEFAULT_PATH;
		}
		String fileName = "";
		try {
		
			for (CommonsMultipartFile file : fileBean.getFile()) {
				if (StringUtils.isEmpty(file.getOriginalFilename())) {
					continue;
				}
				String name = file.getOriginalFilename();
				
				File dir = new File(path);
				if (!dir.exists()) {
					dir.mkdirs();
				}

				File imgFile = new File(path + File.separator + name);
				fileName = path + File.separator + name;
				InputStream is = file.getInputStream();
				OutputStream outs = new FileOutputStream(imgFile);
				byte[] bys = new byte[1024];
				while (is.available() > 0) {
					is.read(bys, 0,
							is.available() > 1024 ? 1024 : is.available());
					outs.write(bys);
					outs.flush();
				}
				is.close();
				outs.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
		return fileName;
	}
}
