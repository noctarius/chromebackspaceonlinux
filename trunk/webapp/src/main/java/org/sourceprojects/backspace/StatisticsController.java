package org.sourceprojects.backspace;

import java.util.Calendar;
import java.util.Date;

import org.sourceprojects.backspace.dao.UsageDataDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/statistics")
public class StatisticsController {

	@Autowired
	private UsageDataDao usageDataDao;
	
	@Transactional(readOnly = true)
	@RequestMapping(value="/complete", method = RequestMethod.GET)
	public String getStatistics(Model model) {
		return null;
	}
	
	@Transactional(readOnly = true)
	@RequestMapping(value="/usercount", method = RequestMethod.GET)
	public String getUsercount(Model model) {
		Calendar cal = Calendar.getInstance();
		cal.setFirstDayOfWeek(Calendar.SUNDAY);
		cal.setTime(new Date());
		cal.add(Calendar.WEEK_OF_MONTH, -1);
		
		int week = cal.get(Calendar.WEEK_OF_YEAR);
		int year = cal.get(Calendar.YEAR);
				
		
		return null;
	}
	
	public void setUsageDataDao(UsageDataDao usageDataDao) {
		this.usageDataDao = usageDataDao;
	}
}
