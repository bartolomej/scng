const scraper = require('../scraper');

describe('Parse html tree data structure', function () {

  it('should parse table head element', function () {
    const th =
      `<th>
				<div>Petek</div>
				<div style="font-size:10px;font-weight:normal;color:#777;">28. 6.</div>
			</th>`
  });

  it('should parse table data element with single text value', function () {
    const td =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-24" class="ednevnik-seznam_ur_teden-td ">
			  <div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;">					
			    <table class="w100 collapse">
					  <tbody>
					    <tr>
						    <td style="border:none;" class="text14 bold">     Kulturni dogodek ob koncu pouka						</td>
						    <td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"></td>
					    </tr>
					  </tbody>
					</table>
			  </div>
			</td>`
  });

  it('should parse td element with multiple text values', function () {
    const td =
      `<td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura">
			  <div class="black bold text14" style="padding-bottom:0px;">1. ura</div>
			  <div class="text10 gray">7:45 - 8:30</div>
		  </td>`;
  });

  it('should parse td element with multiple subelements', function () {
    const div =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-07" class="ednevnik-seznam_ur_teden-td ">
        <div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
        <table class="w100 collapse">
            <tbody>
                <tr>
                    <td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
                    <td style="border:none;" align="right"><a href="javascript:;" onclick="$('#ednevnik-seznam_ur_teden-blok-177824-2019-06-07').toggle();stop_propagation(event);" class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td>
                </tr>
            </tbody>
        </table>
        <div class="text11">
            V. Jug, M1-07 </div>
        <div class="text11 gray bold">Skupina 1</div>
        </div>
        <div id="ednevnik-seznam_ur_teden-blok-177824-2019-06-07" class="ni_prvi">
            <div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;border-top:1px solid #E6E6E6;">
                <table class="w100 collapse">
                    <tbody>
                        <tr>
                            <td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
                            <td style="border:none;" align="right"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="text11">
                    B. Pregelj, P15 </div>
                <div class="text11 gray bold">Skupina 2</div>
            </div>
        </div>
      </td>`;
  });

});