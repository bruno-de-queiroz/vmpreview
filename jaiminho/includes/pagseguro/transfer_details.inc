	#if(${comments})
	<tr>
		<td>
			<br />
		    <font face="arial" size="2"><strong><i>Comentários:</i></strong></font><br />
		</td>
	</tr>
	<tr>
		<td bgcolor="#CCCCCC" style="background-color: #CCCCCC; border: solid 1px black;">
			<br />
			<font face="arial" size="2">${comments.replaceAll("\n", "<br />")}</font>
			<br />
		</td>
	</tr>
	#end