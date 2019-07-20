const {
  parseScheduleTopRow,
  parseTimeTableData,
  parseLessonTableData,
  parseScheduleRow
} = require('../parser');


describe('Parse table elements', function () {

  it('should parse time table data', function () {
    const td =
      `<td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura">
        <div class="black bold text14" style="padding-bottom:0px;">1. ura</div>
        <div class="text10 gray">7:45 - 8:30</div>
		  </td>`;

    expect(parseTimeTableData(td)).toEqual({
      index: '1. ura',
      period: '7:45 - 8:30'
    })
  });

  it('should parse single lesson table data', function () {
    const td =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-27" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold"><span title="Angleščina">ANG</span> </td>
						<td style="border:none;" align="right"></td>
					</tr>
				</table>
				<div class="text11">
					R. Češčut, E36 </div>

			  </div>
		  </td>`;

    expect(parseLessonTableData(td)).toEqual([
      {
        fullName: 'Angleščina',
        shortName: 'ANG',
        teacher: 'R. Češčut',
        classRoom: 'E36 ',
        group: ''
      }
    ]);
  });

  it('should parse double lesson table data', function () {
    const td =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-05-31" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold">
							<span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
						<td style="border:none;" align="right"><a href="javascript:;"
								onclick="$('#ednevnik-seznam_ur_teden-blok-177864-2019-05-31').toggle();stop_propagation(event);"
								class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td>
					</tr>
				</table>
				<div class="text11">
					V. Jug, M1-07 </div>
				<div class="text11 gray bold">Skupina 1</div>
			</div>
			<div id="ednevnik-seznam_ur_teden-blok-177864-2019-05-31" class="ni_prvi">
				<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;border-top:1px solid #E6E6E6;">
					<table class="w100 collapse">
						<tr>
							<td style="border:none;" class="text14 bold">
								<span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
							<td style="border:none;" align="right"></td>
						</tr>
					</table>
					<div class="text11">
						B. Pregelj, P15 </div>
					<div class="text11 gray bold">Skupina 2</div>
          </div>
        </div>
      </td>`;

    expect(parseLessonTableData(td)).toEqual([
      {
        fullName: 'Izdelava osnovnih vezij - praksa',
        shortName: 'IOVp',
        teacher: 'V. Jug',
        classRoom: 'M1-07',
        group: '1'
      },
      {
        fullName: 'Izdelava osnovnih vezij - praksa',
        shortName: 'IOVp',
        teacher: 'B. Pregelj',
        classRoom: 'P15',
        group: '2'
      }
    ])
  });

});


describe('Parse html tree data structure', function () {

  it('should parse top table row', function () {
    const topTableRow =
      `<tr>
		<th width="10%">
			<div style="color:black;">Ura</div>
			<div style="font-size:11px;">&nbsp;</div>
		</th>
		<th>
			<div>Ponedeljek</div>
			<div style="font-size:10px;font-weight:normal;color:#777;">24. 6.</div>
		</th>
		<th>
			<div>Torek</div>
			<div style="font-size:10px;font-weight:normal;color:#777;">25. 6.</div>
		</th>
		<th>
			<div>Sreda</div>
			<div style="font-size:10px;font-weight:normal;color:#777;">26. 6.</div>
		</th>
		<th>
			<div>Četrtek</div>
			<div style="font-size:10px;font-weight:normal;color:#777;">27. 6.</div>
		</th>
		<th>
			<div>Petek</div>
			<div style="font-size:10px;font-weight:normal;color:#777;">28. 6.</div>
		</th>
	</tr>`;

    expect(parseScheduleTopRow(topTableRow)).toEqual([
      {
        day: 'Ponedeljek',
        date: '24. 6.'
      },
      {
        day: 'Torek',
        date: '25. 6.'
      },
      {
        day: 'Sreda',
        date: '26. 6.'
      },
      {
        day: 'Četrtek',
        date: '27. 6.'
      },
      {
        day: 'Petek',
        date: '28. 6.'
      }
    ]);
  });

  /* TODO: write tests for parsing full components
  it('should parse table row with no lectures', function () {
    const div =
      `<tr>
		<td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura">

			<div class="black bold text14" style="padding-bottom:0px;">1. ura</div>
			<div class="text10 gray">7:45 - 8:30</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-24" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold">
							Kulturni dogodek ob koncu pouka </td>
						<td style="border:none;" align="right">
							<img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek" /></td>
					</tr>
				</table>
			</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-25" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;">
				<table class="w100 collapse" title="Šolski koledar">
					<tr>
						<td style="border:none;" class="text14 bold">
							Praznik </td>
						<td style="border:none;" align="right">
							<img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar" /></td>
					</tr>
				</table>
			</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-26" class="ednevnik-seznam_ur_teden-td ">
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-27" class="ednevnik-seznam_ur_teden-td ">
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-28" class="ednevnik-seznam_ur_teden-td ">
		</td>
	</tr>`;
  });

  it('should parse table row with lectures', function () {
    const tableRow =
      `<tr>
		<td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura">

			<div class="black bold text14" style="padding-bottom:0px;">1. ura</div>
			<div class="text10 gray">7:45 - 8:30</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-27" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold"><span title="Angleščina">ANG</span> </td>
						<td style="border:none;" align="right"></td>
					</tr>
				</table>
				<div class="text11">
					R. Češčut, E36 </div>

			</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-28" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold"><span title="Umetnost">UME</span> </td>
						<td style="border:none;" align="right"></td>
					</tr>
				</table>
				<div class="text11">
					S. Peršolja Bučinel, E33 </div>

			</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-29" class="ednevnik-seznam_ur_teden-td ">
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-30" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold"><span title="Umetnost">UME</span> </td>
						<td style="border:none;" align="right"></td>
					</tr>
				</table>
				<div class="text11">
					S. Peršolja Bučinel, E31 </div>

			</div>
		</td>
		<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-05-31" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;">
				<table class="w100 collapse">
					<tr>
						<td style="border:none;" class="text14 bold">
							<span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
						<td style="border:none;" align="right"><a href="javascript:;"
								onclick="$('#ednevnik-seznam_ur_teden-blok-177824-2019-05-31').toggle();stop_propagation(event);"
								class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td>
					</tr>
				</table>
				<div class="text11">
					V. Jug, M1-07 </div>
				<div class="text11 gray bold">Skupina 1</div>
			</div>
			<div id="ednevnik-seznam_ur_teden-blok-177824-2019-05-31" class="ni_prvi">
				<div class="ednevnik-seznam_ur_teden-urnik  " style="color:#444;border-top:1px solid #E6E6E6;">
					<table class="w100 collapse">
						<tr>
							<td style="border:none;" class="text14 bold">
								<span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td>
							<td style="border:none;" align="right"></td>
						</tr>
					</table>
					<div class="text11">
						B. Pregelj, P15 </div>
					<div class="text11 gray bold">Skupina 2</div>
          </div>
        </div>
      </td>
    </tr>`
  });
  */
});