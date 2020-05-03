var lmsCertificates = {
	init: function() {
		jQuery('[activate-certificate-modal]').click(function(){
			jQuery('#js-activate-certificate-modal').modal('show');
		});
		jQuery('#js-activate-certificate-modal .actions .approve').click(function(){
			lmsCertificates.generate();
		});
	},
	generate: function() {
		var filename = 'certificate.pdf';
		var element = document.getElementById('js-certificate');
		var opt = {
			margin:       1,
			filename:     filename,
			image:        { type: 'jpeg', quality: 0.98 },
			html2canvas:  { scale: 2 },
			jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
		};
		html2pdf().from(element).set(opt).save();
		jQuery('#js-activate-certificate-modal').modal('hide');
	}
}

jQuery(document).ready(function(){
	lmsCertificates.init();
});
