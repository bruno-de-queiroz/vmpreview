	#if ($!{userSecretPhrase} && !$!{userCanceled})
	<tr><!-- cabecalho:inicio -->
		<td bgcolor="#f2f6f9">
			<table>
				<tr>
					<td valign="top"><img alt="" src="https://p.simg.uol.com.br/out/pagseguro/i/email/alert_medium_info.gif"/></td>
					<td>
						<p><font face="arial" size="-1"><strong>Controle anti-fraude*:</strong> sua frase de segurança é $!{userSecretPhrase}</font></p>
						<p><font face="arial" color="gray" size="-2">
						* O controle antifraude garante a confiabilidade do remetente.
						Caso esta informação não apareça ou esteja errada, <a href="http://denuncia.uol.com.br/" title="" target="_blank">denuncie</a>!
						Alguém pode estar usando o nome do UOL para enviar e-mails maliciosos.
						</font></p>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr><td>&nbsp;</td></tr>
	#end
	<tr><!-- cabecalho:inicio -->
		<td align="center">
			<font face="arial"><img src="https://p.simg.uol.com.br/out/pagseguro/i/email/pagseguro_uol.gif?091125" alt="PagSeguro UOL" width="266" height="66" /></font>
			<hr />
		</td>
	</tr><!-- cabecalho:fim -->
