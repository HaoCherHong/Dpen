//----------------GA-----------------
var _AnalyticsCode = 'UA-61516445-3';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
//----------------GA-----------------

function sendInvitation(first) {
	getAPI('dcard/accept?first=' + first, function(result, error) {
		if(!error) {
			_gaq.push(['_trackEvent', 'action', 'Send Invitation']);
			//success
			window.location.reload()
		} else {
			alert(error)
		}
	})
}

function getAPI(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	  	if(xhr.status === 200) {
	  		var response = JSON.parse(xhr.responseText)
	  		if(!response.error) {
	  			callback(response)
		  	} else {
		  		callback(null, response.msg)
		  	}
	  	} else {
	  		callback(null, 'Error ' + xhr.status)
	  	}
	  }
	};
	xhr.open("GET", 'https://www.dcard.tw/api/' + url, true);
	xhr.send();
}

function hide(element) {
	if(element.className.indexOf('hidden') === -1) {
		element.className += ' hidden'
	}
}

function show(element) {
	element.className = element.className.replace(/\bhidden\b/,'');
}

function replaceLinebreak(str) {
	return str.replace(/(?:\r\n|\r|\n)/g, '<br />')
}

function showDcard() {
	//Show dcard div
	show(document.getElementById('dcard'))
	//Show dcard photo
	document.getElementById('dcard_photo').src = 'https://www.dcard.tw/api/dcard/photo'
	//Fake photo
	// document.getElementById('dcard_photo').src = 'https://www.dcard.tw/img/scratchpad/ducks.jpg'
	
	//Fill data
	getAPI('dcard/', function(result, error) {
		if(!error) {

			var showFormButton = document.getElementById('btn_show_invitation_form')
			var sendButton = document.getElementById('btn_send')
			var textarea = document.getElementById('textarea_invitation')

			//Setup send button
			sendButton.addEventListener('click', function() {
				sendInvitation(textarea.value)
			})

			//Setup invitation textarea
			textarea.addEventListener('input', function() {
				if(textarea.value.length > 0) {
					sendButton.removeAttribute('disabled')
				} else {
					sendButton.setAttribute('disabled', 'disabled')
				}
			})

			//Setup cancel button
			document.getElementById('btn_cancel').addEventListener('click', function() {
				hide(document.getElementById('invitation_form'))
				show(document.getElementById('dcard_table'))
				textarea.value = ''
				showFormButton.removeAttribute('disabled')
			})

			//Show invitation button or label
			if(!result.connection.accept) {
				showFormButton.addEventListener('click', function() {
					hide(document.getElementById('dcard_table'))
					show(document.getElementById('invitation_form'))
					showFormButton.setAttribute('disabled', 'disabled')
				})
				show(showFormButton)
			} else {
				if(result.both_accept) {
					show(document.getElementById('label_invitation_accepted'))
				} else {
					show(document.getElementById('label_invitation_sent'))
				}
			}

			//Fake data
			// result.dcard = {
	  //           gender: "F",
	  //           school: "新天鵝堡大學",
	  //           department: "治癒系",
	  //           grade: "Lv.max",
	  //           talent: "專長:脹氣、上電視 興趣: 仰望星空、載浮載沉",
	  //           club: "沒有任何室內活動的社團願意接受我QAQ",
	  //           lecture: "游泳課、激勵講座、治癒講座",
	  //           lovedcountry: "亞洲地區都不錯",
	  //           trouble: "亞洲地區都不錯，人比周邊商品還多",
	  //           wanttotry: "最近比較洩氣，情緒不穩又常常爆氣。冬天風太大",
	  //           exchange: "如何從小變大、如何激勵自己替自己打氣",
	  //           photo: "./img/scratchpad/ducks.jpg",
	  //           createdAt: "2014-01-07T03:10:49.000Z",
	  //           updatedAt: "2014-01-07T03:10:49.000Z"
	  //       }

			//Fill Dcard table
			var genderTd = document.getElementById('dcard_gender')
			var schoolTd = document.getElementById('dcard_school')
			var departmentTd = document.getElementById('dcard_department')
			var gradeTd = document.getElementById('dcard_grade')
			var talentTd = document.getElementById('dcard_talent')
			var clubTd = document.getElementById('dcard_club')
			var lectureTd = document.getElementById('dcard_lecture')
			var lovedcountryTd = document.getElementById('dcard_lovedcountry')
			var troubleTd = document.getElementById('dcard_trouble')
			var exchangeTd = document.getElementById('dcard_exchange')
			var wanttotryTd = document.getElementById('dcard_wanttotry')

			genderTd.innerText = result.dcard.gender;
			genderTd.innerText = result.dcard.gender
			schoolTd.innerText = result.dcard.school
			departmentTd.innerText = result.dcard.department
			gradeTd.innerText = result.dcard.grade
			talentTd.innerHTML = replaceLinebreak(result.dcard.talent)
			clubTd.innerHTML = replaceLinebreak(result.dcard.club)
			lectureTd.innerHTML = replaceLinebreak(result.dcard.lecture)
			lovedcountryTd.innerHTML = replaceLinebreak(result.dcard.lovedcountry)
			troubleTd.innerHTML = replaceLinebreak(result.dcard.trouble)
			exchangeTd.innerHTML = replaceLinebreak(result.dcard.exchange)
			wanttotryTd.innerHTML = replaceLinebreak(result.dcard.wanttotry)
		} else {
			alert(error)
		}
	})
}

function showNotificationLinks(status) {
	//Show Notifications div
	show(document.getElementById("notification_links"))

	//Update Mails
	var mailLink = document.getElementById("link_unread_mail")
	mailLink.addEventListener('click', function() {
		_gaq.push(['_trackEvent', 'click', 'mails link']);
		var win = window.open('https://www.dcard.tw/notification', '_blank');
		win.focus;
	})
	if(status.newsUnread) {
		mailLink.className = "notify"
		mailLink.innerText = "你有 " + status.newsUnread + " 封未讀信件"
	}

	//Update Notifications
	getAPI('member/new_notification', function(response, error) {
		var unreadNotifications = response.notification.filter(function(item) {
			return item.seenAt <= item.updatedAt
			}).length
		var notificationLink = document.getElementById("link_unread_notification")
		notificationLink.addEventListener('click', function() {
			_gaq.push(['_trackEvent', 'click', 'notifications link']);
			var win = window.open('https://www.dcard.tw/', '_blank');
			win.focus;
		})

		if(unreadNotifications) {
		notificationLink.className = "notify"
		notificationLink.innerText = "你有 " + unreadNotifications + " 個未讀通知"
	}
	})
}

document.addEventListener('DOMContentLoaded', function() {
	_gaq.push(['_trackEvent', 'action', 'popup']);
	//links
	document.getElementById('logo').addEventListener('click', function() {
		_gaq.push(['_trackEvent', 'click', 'logo']);
		var win = window.open('https://www.dcard.tw/dcard', '_blank');
		win.focus;
	})
	document.getElementById('link_share').addEventListener('click', function() {
		_gaq.push(['_trackEvent', 'click', 'share']);
		var win = window.open('https://chrome.google.com/webstore/detail/dpen/aflhihlkalkmbjgjhejhloapaljaohih/', '_blank');
		win.focus;
	})
	document.getElementById('link_wootrans').addEventListener('click', function() {
		_gaq.push(['_trackEvent', 'click', 'wootrans']);
		var win = window.open('https://chrome.google.com/webstore/detail/wootrans/jonegeahehknbgnifdfbnidfpfigpdcp/', '_blank');
		win.focus;
	})

	//get login status
	getAPI('member/status', function(status, error) {
		if(!error) {
			if(status.isLogin) {
				//Show Dcard
				showDcard();
				//Show Notifications
				showNotificationLinks(status);
			} else {
				//Show login button
				var loginButton = document.getElementById('login_button');
				show(loginButton);
				loginButton.addEventListener('click', function() {
					_gaq.push(['_trackEvent', 'action', 'login']);
					var win = window.open('https://www.dcard.tw/login', '_blank');
					win.focus();
				})
			}
		} else {
			alert(error)
		}
	});
	
	//Check if just installed
	chrome.storage.sync.get('installedVersion', function(items) {
		var currentVersion = chrome.app.getDetails().version
		var installedVersion = items.installedVersion
		if(installedVersion == undefined || currentVersion > installedVersion) {
			chrome.storage.sync.set({'installedVersion': currentVersion})
			_gaq.push(['_trackEvent', 'other', 'installed', currentVersion.toString()]);
		}
	})
});