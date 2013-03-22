#if ("$isDebtorNotification" == "true")
	#set($isDebtorNotification = true)
#else
	#set($isDebtorNotification = false)
#end

#if(${cartItensData})
<tr><!-- carrinho:inicio -->
	<td>
		<font face="Arial" size="2">
		<br /><br />
		<table cellspacing="0" cellpadding="5" rules="groups" border="0" bordercolor="#DBDBDB" summary="carrinho">
		<thead>
				<tr bgcolor="#EEEEEE">
				#if(${serviceCharging} == "true")
					<th width="400"><font color="#515151">SERVIÇO</font></th>
					<th><font color="#515151">VALOR&nbsp;(R$)</font></th>
				#else
					<th><font color="#515151">ITENS DO PEDIDO</font></th>
					<th><font color="#515151">QUANTIDADE</font></th>
					<th><font color="#515151">VALOR&nbsp;(R$)</font></th>
					<th><font color="#515151">TOTAL&nbsp;(R$)</font></th>
				#end
				</tr>
		</thead>
		<tbody align="right">
		${cartItensData}
		</tbody>
		<tfoot align="right">
			#if(${cartExtraValue})
			<tr>
				<td colspan="4">Extra: R$&nbsp;${cartExtraValue}</td>
			</tr>
			#end
			#if(${cartFreightValue})
			<tr>
				<td colspan="4">Frete: R$&nbsp;${cartFreightValue}</td>
			</tr>
			#end
			#if($transactionDiscount)
			<tr>
				<td colspan="4">Desconto: R$&nbsp;${transactionDiscount}</td>
			</tr>
			#end
			#if($isDebtorNotification && ${transactionTaxValue})
			<tr>
				<td colspan="4">Taxas#if("$!transactionPaymentMethod"=="BOOKLET")*#end: R$&nbsp;${transactionTaxValue}</td>
			</tr>
			#end
			<tr>
			#if($isDebtorNotification) 
				<td colspan="4"><b>Total geral: R$&nbsp;${transactionValue}</b><hr size="1" color="#449c38"/></td>
			#else
				<td colspan="4"><b>Total geral: R$&nbsp;${transactionOriginalValueWithDiscount}</b><hr size="1" color="#449c38"/></td>
			#end
			</tr>
		</tfoot>
		</table>
		</font>
	</td>
</tr>
#if($isDebtorNotification && ${transactionTaxValue} && "$!transactionPaymentMethod"=="BOOKLET")
<tr><td><p><font face="arial" size="1" color="#999">*Taxa aplicada para cobrir custos de gestão de risco do meio de pagamento.</font></p></td></tr>
#end
<!-- carrinho:fim -->
#end