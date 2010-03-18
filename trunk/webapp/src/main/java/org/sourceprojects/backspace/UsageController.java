package org.sourceprojects.backspace;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.JsonConfig;

import org.sourceprojects.backspace.dao.UsageDataDao;
import org.sourceprojects.backspace.domain.UsageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/usage")
@Transactional
public class UsageController {

	@Autowired
	private UsageDataDao usageDataDao;
	
	@RequestMapping(method = RequestMethod.POST)
	public String addUsageCollectorData(@RequestBody String json, Model model) {
		JSONObject object = (JSONObject) JSONSerializer.toJSON(json);
		JsonConfig config = new JsonConfig();
		config.setRootClass(UsageData.class);
		UsageData usageData = (UsageData) JSONSerializer.toJava(object, config);
		
		usageDataDao.save(usageData);
		
		JSONObject result = new JSONObject();
		result.put("timeid", usageData.getTimeId());
		
		return result.toString();
	}
	
	public void setUsageDataDao(UsageDataDao usageDataDao) {
		this.usageDataDao = usageDataDao;
	}
}
