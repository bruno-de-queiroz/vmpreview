<p style="margin-left:25px;"><font face="arial" size="2"><strong>Detalhes da transa&ccedil;&atilde;o:</strong></font></p>
<p style="padding:10px; margin:0 25px; margin-bottom:10px; background:#f4f4f4;">      
        <font face="arial" size="2">C&oacute;digo da transa&ccedil;&atilde;o: <strong>${transactionCode}</strong></font><br />
        <font face="arial" size="2">Valor total: <strong>R$ $!{transactionValue}</strong></font><br />
        <font face="arial" size="2">Data/hora: <strong>$!{transactionDate}</strong></font><br />
        #if($!bankStatement != "true")
        	<font face="arial" size="2">Vendedor: <strong>$!{transactionSeller}</strong></font><br />
    	#end
</p>