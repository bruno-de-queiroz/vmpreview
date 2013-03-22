	<tr><!-- rodape:inicio -->
		<td>
			#if (($!{userSecretPhrase} || $!{userRegistered}) && !$!{userCanceled} && !$!{noTransactionInfo})
			<font face="arial" size="-1"><br />Para acompanhar as suas transações ou alterar os dados da sua conta, acesse <a href="http://www.pagseguro.com.br/" title="PagSeguro UOL" target="_blank">http://www.pagseguro.com.br</a></font>
			<br /><br />
			#end
			#if ($!{userCanceled})
			<font face="arial" size="-1"><br />Reative sua conta! Você poderá ver os detalhes desta transação, abrir disputas e armazenar seus cartões preferenciais. Basta acessar o site do PagSeguro e inserir seu e-mail e senha na área "Minha Conta".</font>
			<br /><br />
			#end
			<font face="arial" size="-1">
				<br>Atenciosamente,<br>Equipe PagSeguro.<br><br>
				<strong>PagSeguro.</strong> Sua compra protegida.
			</font>
		</td>
	</tr>
	<tr>
		<td align="center">
			<hr size="2" color="#EFEFEF">
			<font face="arial" size="-1">
			DÚVIDAS? Acesse #set($url1='http://www.pagseguro.com.br/atendimento')
			<a href="${url1}">${url1}</a>
			</font>
		</td>
	</tr>
	<tr>
		<td align="center">
			<hr size="2" color="#EFEFEF">
			<font face="arial" size="-1">Este é um e-mail automático disparado pelo sistema. Favor não respondê-lo, pois esta conta não é monitorada.</font>
		</td>
	</tr>
	<tr>
	    <td background="https://p.simg.uol.com.br/out/pagseguro/i/email/deg_rodapemail.gif">&nbsp;</td>
	</tr><!-- rodape:fim -->
