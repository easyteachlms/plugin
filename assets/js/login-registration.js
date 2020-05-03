var loginAndRegistration = {
    login: {
        form: function() {
            ajax_login_object.redirecturl = window.location.href;
            jQuery('.easylms-login .button.primary').click(function(){
                var username = jQuery('.easylms-login input[name=loginEmail]').val();
                var password = jQuery('.easylms-login input[name=loginPassword]').val();
                var security = jQuery('.easylms-login input#security').val();
				console.log(username);
				console.log(password);
				console.log(security);
                jQuery(this).addClass('loading');
                loginAndRegistration.login.handler(username, password, security);
            });
        },
        handler: function(username, password, security) {
			jQuery.post(
				ajax_login_object.ajaxurl,
				{
					'action': 'ajax_login',
					'username': username,
					'password': password,
					'security': security
				},
				function(response) {
                    if ( response == true ){
                        jQuery('.easylms-login button[type="submit"]').text('Logging In');
                        jQuery('.easylms-login button[type="submit"]').removeClass('loading').addClass('positive');
                        document.location.href = ajax_login_object.redirecturl;
                    }
				}
			);
        }
    },
	registration: {
		form: function() {
			var formData = {
				username: '',
				firstname: '',
				lastname: '',
				email: '',
				password: '',
				security: '',
			}
			jQuery('.easylms-registration .ui.dropdown').dropdown();
			jQuery('.easylms-registration .ui.checkbox').checkbox();
            jQuery('.easylms-registration .button.primary').click(function(){
				formData.username = jQuery('.easylms-registration input[name="email-address"]').val();
				formData.firstname = jQuery('.easylms-registration input[name="first-name"]').val();
				formData.lastname = jQuery('.easylms-registration input[name="last-name"]').val();
				formData.email = jQuery('.easylms-registration input[name="email-address"]').val();
				formData.password = jQuery('.easylms-registration input[name="password"]').val();
				formData.security = jQuery('input#security').val();
				console.log(formData);
				jQuery(this).text('Creating Account..');
				jQuery(this).addClass('loading');
				loginAndRegistration.registration.handler(formData);
            });

		},
		handler: function(formData) {
			console.log('Running Handler');
			console.log(formData);
			jQuery.post(
				ajax_login_object.ajaxurl,
				{
					'action': 'ajax_registration',
					'username': formData.username,
					'firstname': formData.firstname,
					'lastname': formData.lastname,
					'email': formData.email,
					'password': formData.password,
					'security': formData.security
				},
				function(response) {
					console.log('Response');
                    if ( response == "true" ){
						jQuery('.easylms-registration .button.primary').removeClass('loading').addClass('positive');
						document.location.href = ajax_login_object.redirecturl;
                    } else {
						console.log(response);
					}
				}
			);
		}
	}
}

jQuery(document).ready(function(){
    loginAndRegistration.login.form();
	loginAndRegistration.registration.form();
});
