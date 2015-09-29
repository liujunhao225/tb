package com.oscar.oscar.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.oscar.oscar.util.FileSaveUtil;
import com.oscar.oscar.util.FileUploadBean;

@Component
@Controller
@RequestMapping("/upload")
public class UploadClass {

	@RequestMapping(value = "/upload.do", method = RequestMethod.POST)
	@ResponseBody
	public String uploadExcellData(FileUploadBean file,
			HttpServletResponse response) {
		CommonsMultipartFile multiFile = file.getFile()[0];
		try {
			String ss = multiFile.getOriginalFilename();
			String name1 = new String(ss.getBytes("ISO-8859-1"), "utf-8");
			System.out.println(name1);
			FileSaveUtil.save(file, "");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		JSONObject job = new JSONObject();
		job.put("msg", "success");
		return job.toString();

	}

	public static void main(String[] args) {
		File file = new File("d:\\RUNNING.txt");
		FileInputStream is;
		try {
			is = new FileInputStream(file);
			byte[] bb = new byte[1024];
			while (is.available() > 0) {
				is.read(bb, 0, is.available() >= 1024 ? 1024 : is.available());
				System.out.println(new String(bb, "utf-8"));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
