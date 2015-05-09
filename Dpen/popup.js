//----------------GA-----------------
var debug_enabled = false;
var _AnalyticsCode = '';

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
			if(!result.error) {
				//success
				window.close();
			} else {
				alert(result.msg)
			}
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
	  		callback(JSON.parse(xhr.responseText))
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
			if(true || !result.connection.accept) {
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

document.addEventListener('DOMContentLoaded', function() {
	//links
	document.getElementById('link_dcard').addEventListener('click', function() {
		var win = window.open('https://www.dcard.tw/', '_blank');
		win.focus;
	})
	document.getElementById('link_wootrans').addEventListener('click', function() {
		var win = window.open('https://chrome.google.com/webstore/detail/wootrans/jonegeahehknbgnifdfbnidfpfigpdcp/', '_blank');
		win.focus;
	})

	//get login status
	getAPI('member/status', function(status, error) {
		if(!error) {
			if(status.isLogin) {
				showDcard();
			} else {
				//Show login button
				var loginButton = document.getElementById('login_button');
				show(loginButton);
				loginButton.addEventListener('click', function() {
					var win = window.open('https://www.dcard.tw/login', '_blank');
					win.focus();
				})
			}
		} else {
			alert(error)
		}
	});
	
});