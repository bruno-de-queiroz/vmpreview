#if(!$commentLabel)
	#set($commentLabel="Comentário")
#end
<tr>
	<td>
		<br />
		<font face="arial" size="2">$!commentLabel: </font><br />
	</td>
</tr>
<tr>
	<td bgcolor="#CCCCCC" style="background-color: #CCCCCC; border: solid 1px black;">
		<br />
		<font face="arial" size="2">${comments.replaceAll("\n", "<br />")}</font>
	</td>
</tr>
	