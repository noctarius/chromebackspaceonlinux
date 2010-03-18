package org.sourceprojects.backspace.domain;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class CachedStatistic {

	@Id
	@GeneratedValue
	private Long id;

	@Enumerated(EnumType.ORDINAL)
	private StatisticType type;
	
	@Temporal(TemporalType.DATE)
	private Date date;
	
	private Long users;
	
	private Long clicks;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Long getUsers() {
		return users;
	}

	public void setUsers(Long users) {
		this.users = users;
	}

	public Long getClicks() {
		return clicks;
	}

	public void setClicks(Long clicks) {
		this.clicks = clicks;
	}

	public StatisticType getType() {
		return type;
	}

	public void setType(StatisticType type) {
		this.type = type;
	}

}
