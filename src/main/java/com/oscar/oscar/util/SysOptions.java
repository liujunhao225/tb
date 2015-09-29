package com.oscar.oscar.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;

public final class SysOptions {

	public static Logger logger = Logger.getLogger(SysOptions.class);

	private static final SysOptions _instance = new SysOptions();
	private Properties optionProps = new Properties();

	private SysOptions() {

		try {
			InputStream stream = SysOptions.class
					.getResourceAsStream("sys.properties");
			optionProps.load(stream);
		} catch (IOException e) {

			e.printStackTrace();
			// logger.info("Loading `SysOptions failed: " + e.getMessage());
		}

	}

	public static final SysOptions options() {
		return _instance;
	}

	public String opt(String opt) {
		return opt(opt, "");
	}

	public String opt(String opt, String _default) {
		return optionProps.getProperty(opt, _default);
	}

	public boolean debugMode() {
		return "debug".equalsIgnoreCase(opt("sys.mode"));
	}

	public String get(String optkey, String _default) {
		if (debugMode() && optkey.endsWith(".DEBUG")) {
			return get(optkey + ".DEBUG", _default);
		} else {
			String value = opt(optkey, _default);
			if (value == null && optkey.endsWith(".DEBUG")) {
				return opt(optkey.replaceAll("\\.DEBUG$", ""));
			}
			return value;
		}
	}
	
	public static void main(String args[]){
		String ss = SysOptions.options().get("turn_pic_path", "");
		System.out.println(ss);
		
	}
}
