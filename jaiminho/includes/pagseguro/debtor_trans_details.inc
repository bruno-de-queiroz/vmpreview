	<tr>
	  <td style="padding-left:25px;"><br>
	    <font face="arial" size="2"><strong>Status:</strong> ${transactionStatus}</font><br />
	    <font face="arial" size="2"><strong>Código:</strong> ${transactionCode}</font><br />
	    #if(${creditorWebsiteURL})<font face="arial" size="2"><strong>Site:</strong> <a href="${creditorWebsiteURL}">${creditorWebsiteURL}</a></font><br />#end
	    <font face="arial" size="2"><strong>E-mail:</strong> <a href="mailto:${creditorEmail}">${creditorEmail}</a></font><br />
	    #if(${creditorContactPhone})<font face="arial" size="2"><strong>Telefone:</strong> ${creditorContactPhone}</font> <br/> #end	      
	  <br></td>
	</tr>
	#parse("/includes/pagseguro/transfer_details.inc")