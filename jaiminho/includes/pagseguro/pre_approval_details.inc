	<p style="margin-left:25px;"><font face="arial" size="2"><strong>$!{preApprovalName}</strong></font></p>
	<p style="padding:10px; margin:0 25px; margin-bottom:10px; background:#f4f4f4;">	
		<font face="arial" size="2">Status: ${preApprovalStatus}</font><br />
		<font face="arial" size="2">Identificador: ${preApprovalTracker}</font><br />
		<font face="arial" size="2">Meio de Pagamento:#if("$!asSeller" != "true") ${preApprovalPaymentMethod} #else Cartão de crédito #end</font><br />
		<font face="arial" size="2">Data de contratação: ${preApprovalAuthorizationDate}</font><br />
		#if(${preApprovalExpirationDate})#if($bold)<font face="arial" size="2"><b>Data de expiração: ${preApprovalExpirationDate}</b> #else<font face="arial" size="2">Data de expiração: ${preApprovalExpirationDate} #end</font><br />#end		
	</p>
