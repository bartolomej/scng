const {
  parseScheduleTopRow,
  parseTimeTableData,
  parseLessonTableData,
  parseScheduleRow,
  parseScheduleTable
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
        type: 'lesson',
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
        type: 'lesson',
        fullName: 'Izdelava osnovnih vezij - praksa',
        shortName: 'IOVp',
        teacher: 'V. Jug',
        classRoom: 'M1-07',
        group: '1'
      },
      {
        type: 'lesson',
        fullName: 'Izdelava osnovnih vezij - praksa',
        shortName: 'IOVp',
        teacher: 'B. Pregelj',
        classRoom: 'P15',
        group: '2'
      }
    ])
  });

  it('should parse table row with no lectures', function () {
    const td =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-24" class="ednevnik-seznam_ur_teden-td ">
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
		</td>`;

    expect(parseLessonTableData(td)).toEqual([
      {
        type: 'other',
        fullName: 'Kulturni dogodek ob koncu pouka ',
        shortName: '',
        teacher: '',
        group: '',
        classRoom: '',
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
      
    </tr>`;

    expect(parseScheduleRow(tableRow)).toEqual([
      {
        index: '1. ura',
        period: '7:45 - 8:30'
      },
      [
        {
          type: 'lesson',
          fullName: 'Angleščina',
          shortName: 'ANG',
          teacher: 'R. Češčut',
          classRoom: 'E36 ',
          group: ''
        }
      ],
      [
        {
          type: 'lesson',
          fullName: 'Umetnost',
          shortName: 'UME',
          teacher: 'S. Peršolja Bučinel',
          classRoom: 'E33 ',
          group: ''
        }
      ],
      [

      ],
      [
        {
          type: 'lesson',
          fullName: 'Umetnost',
          shortName: 'UME',
          teacher: 'S. Peršolja Bučinel',
          classRoom: 'E31 ',
          group: ''
        }
      ],
      [
        {
          type: 'lesson',
          fullName: 'Izdelava osnovnih vezij - praksa',
          shortName: 'IOVp',
          teacher: 'V. Jug',
          classRoom: 'M1-07',
          group: '1'
        },
        {
          type: 'lesson',
          fullName: 'Izdelava osnovnih vezij - praksa',
          shortName: 'IOVp',
          teacher: 'B. Pregelj',
          classRoom: 'P15',
          group: '2'
        }
      ]
    ])
  });

  it('should parse table row without lectures', function () {
    const tr =
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

    expect(parseScheduleRow(tr)).toEqual([
      {
        index: '1. ura',
        period: '7:45 - 8:30'
      },
      [
        {
          type: 'other',
          fullName: 'Kulturni dogodek ob koncu pouka ',
          shortName: '',
          teacher: '',
          group: '',
          classRoom: '',
        }
      ],
      [
        {
          type: 'other',
          fullName: 'Praznik ',
          shortName: '',
          teacher: '',
          group: '',
          classRoom: '',
        }
      ],
      [], // no school
      [], // no school
      [], // no school
    ])
  });

  it('should parse full schedule table without lessons', function () {
    const table = `4324. 6. 201930. 6. 2019<div class="hidden"style="background-color:#fff;padding:3px;border:1px solid #E6E6E6;border-bottom:0;"><table class="w100"><tr><td class="bold" width="60">OPOMBE:</td><td class="lgray"><em></em></td></tr></table></div><table class="ednevnik-seznam_ur_teden"><tr><th width="10%"><div style="color:black;">Ura</div><div style="font-size:11px;">&nbsp;</div></th><th><div>Ponedeljek</div><div style="font-size:10px;font-weight:normal;color:#777;">24. 6.</div></th><th><div>Torek</div><div style="font-size:10px;font-weight:normal;color:#777;">25. 6.</div></th><th><div>Sreda</div><div style="font-size:10px;font-weight:normal;color:#777;">26. 6.</div></th><th><div>Četrtek</div><div style="font-size:10px;font-weight:normal;color:#777;">27. 6.</div></th><th><div>Petek</div><div style="font-size:10px;font-weight:normal;color:#777;">28. 6.</div></th></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">0. predura</div><div class="text10 gray">6:55 - 7:40</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-24" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">1. ura</div><div class="text10 gray">7:45 - 8:30</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Kulturni dogodek ob koncu pouka </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">2. ura</div><div class="text10 gray">8:35 - 9:20</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Kulturni dogodek ob koncu pouka </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">3. ura</div><div class="text10 gray">9:25 - 10:10</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Kulturni dogodek ob koncu pouka </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">4. ura</div><div class="text10 gray">10:15 - 11:00</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Kulturni dogodek ob koncu pouka </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">5. ura</div><div class="text10 gray">11:00 - 11:45</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Kulturni dogodek ob koncu pouka </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">6. ura</div><div class="text10 gray">11:50 - 12:35</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Razredna ura </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">7. ura</div><div class="text10 gray">12:40 - 13:25</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Razredna ura </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">8. ura</div><div class="text10 gray">13:30 - 14:15</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-24" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold">Razredna ura </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Dogodek"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">9. ura</div><div class="text10 gray">14:20 - 15:05</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-24" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-25" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;"><table class="w100 collapse" title="Šolski koledar"><tr><td style="border:none;" class="text14 bold">Praznik </td><td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"/></td></tr></table></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-26" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-27" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-28" class="ednevnik-seznam_ur_teden-td "></td></tr></table>17`;

    const parsed = parseScheduleTable(table);

    expect(parsed.length).toEqual(10);
    parsed.forEach(row => expect(row.length).toEqual(6));
  });

  it('should parse full schedule table with lessons', function () {
    const table = `4110. 6. 201916. 6. 2019<div class="hidden"style="background-color:#fff;padding:3px;border:1px solid #E6E6E6;border-bottom:0;"><table class="w100"><tr><td class="bold" width="60">OPOMBE:</td><td class="lgray"><em></em></td></tr></table></div><table class="ednevnik-seznam_ur_teden"><tr><th width="10%"><div style="color:black;">Ura</div><div style="font-size:11px;">&nbsp;</div></th><th><div>Ponedeljek</div><div style="font-size:10px;font-weight:normal;color:#777;">10. 6.</div></th><th><div>Torek</div><div style="font-size:10px;font-weight:normal;color:#777;">11. 6.</div></th><th><div>Sreda</div><div style="font-size:10px;font-weight:normal;color:#777;">12. 6.</div></th><th><div>Četrtek</div><div style="font-size:10px;font-weight:normal;color:#777;">13. 6.</div></th><th><div>Petek</div><div style="font-size:10px;font-weight:normal;color:#777;">14. 6.</div></th></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">0. predura</div><div class="text10 gray">6:55 - 7:40</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-10" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-12" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-13" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-06-14" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">1. ura</div><div class="text10 gray">7:45 - 8:30</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Angleščina">ANG</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">R. Češčut, E36 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Športna vzgoja">ŠVZ</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Čehovin, ŠP2 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Umetnost">UME</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">S. Peršolja Bučinel, E31 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-1-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td><td style="border:none;" align="right"><a href="javascript:;"onclick="$('#ednevnik-seznam_ur_teden-blok-177824-2019-06-14').toggle();stop_propagation(event);"class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td></tr></table><div class="text11">V. Jug, M1-07 </div><div class="text11 gray bold">Skupina 1</div></div><div id="ednevnik-seznam_ur_teden-blok-177824-2019-06-14" class="ni_prvi"><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;border-top:1px solid #E6E6E6;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">B. Pregelj, P15 </div><div class="text11 gray bold">Skupina 1</div></div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">2. ura</div><div class="text10 gray">8:35 - 9:20</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Kemija">KEM</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Rutar, A22 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Upravljanje s programirljivimi napravami">UPN</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">G. Milič, E21 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Geografija">GEO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">T. Stanič, D32 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-2-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td><td style="border:none;" align="right"><a href="javascript:;"onclick="$('#ednevnik-seznam_ur_teden-blok-177864-2019-06-14').toggle();stop_propagation(event);"class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td></tr></table><div class="text11">V. Jug, M1-07 </div><div class="text11 gray bold">Skupina 1</div></div><div id="ednevnik-seznam_ur_teden-blok-177864-2019-06-14" class="ni_prvi"><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;border-top:1px solid #E6E6E6;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij - praksa">IOVp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">B. Pregelj, P15 </div><div class="text11 gray bold">Skupina 2</div></div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">3. ura</div><div class="text10 gray">9:25 - 10:10</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Matematika">MAT</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">U. Komel, E34 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Slovenščina">SLO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">M. Figelj, E18 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij">IOV</span></td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Ipavec, E31 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-3-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Slovenščina">SLO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">M. Figelj, E18 </div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">4. ura</div><div class="text10 gray">10:15 - 11:00</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Upravljanje s programirljivimi napravami">UPN</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">G. Milič, E21 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Slovenščina">SLO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">M. Figelj, E18 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Matematika">MAT</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">U. Komel, E34 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-4-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Športna vzgoja">ŠVZ</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Čehovin, TVB </div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">5. ura</div><div class="text10 gray">11:00 - 11:45</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-10" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-11" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Geografija">GEO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">T. Stanič, D32 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-12" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-13" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-5-2019-06-14" class="ednevnik-seznam_ur_teden-td "></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">6. ura</div><div class="text10 gray">11:50 - 12:35</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij">IOV</span></td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Ipavec, E31 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-11" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Kemija">KEM</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Rutar, A22 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Angleščina">ANG</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">R. Češčut, E36 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij">IOV</span></td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Ipavec, E31 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-6-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem">ITK</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Brecelj, E11 </div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">7. ura</div><div class="text10 gray">12:40 - 13:25</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Športna vzgoja">ŠVZ</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Čehovin, TVB </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-11" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Vzdrževanje računalniške opreme - praksa">VROp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Bizaj, P12 </div><div class="text11 gray bold">Skupina 1</div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem - praksa">ITKp</span> </td><td style="border:none;" align="right"><a href="javascript:;"onclick="$('#ednevnik-seznam_ur_teden-blok-177889-2019-06-12').toggle();stop_propagation(event);"class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td></tr></table><div class="text11">I. Brecelj, E22 </div><div class="text11 gray bold">Skupina 1</div></div><div id="ednevnik-seznam_ur_teden-blok-177889-2019-06-12" class="ni_prvi"><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;border-top:1px solid #E6E6E6;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem - praksa">ITKp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">G. Vodopivec, B35 </div><div class="text11 gray bold">Skupina 2</div></div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Angleščina">ANG</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">R. Češčut, E36 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-7-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem">ITK</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">I. Brecelj, E11 </div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">8. ura</div><div class="text10 gray">13:30 - 14:15</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-10" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Vzdrževanje računalniške opreme">VRO</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Bizaj, P12 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-11" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Vzdrževanje računalniške opreme - praksa">VROp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Bizaj, P12 </div><div class="text11 gray bold">Skupina 1</div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-12" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem - praksa">ITKp</span> </td><td style="border:none;" align="right"><a href="javascript:;"onclick="$('#ednevnik-seznam_ur_teden-blok-177894-2019-06-12').toggle();stop_propagation(event);"class="ednevnik-seznam_ur_teden-vec_ur" title="Več skupin">2</a></td></tr></table><div class="text11">I. Brecelj, E22 </div><div class="text11 gray bold">Skupina 1</div></div><div id="ednevnik-seznam_ur_teden-blok-177894-2019-06-12" class="ni_prvi"><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;border-top:1px solid #E6E6E6;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Informatika s tehniškim komuniciranjem - praksa">ITKp</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">G. Vodopivec, B35 </div><div class="text11 gray bold">Skupina 2</div></div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-13" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Razredna ura">RU</span> </td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Ipavec, E31 </div></div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-8-2019-06-14" class="ednevnik-seznam_ur_teden-td "><div class="ednevnik-seznam_ur_teden-urnik " style="color:#444;"><table class="w100 collapse"><tr><td style="border:none;" class="text14 bold"><span title="Izdelava osnovnih vezij">IOV</span></td><td style="border:none;" align="right"></td></tr></table><div class="text11">E. Ipavec, E31 </div></div></td></tr><tr><td width="10%" class="ednevnik-seznam_ur_teden-td ednevnik-seznam_ur_teden-ura"><div class="black bold text14" style="padding-bottom:0px;">9. ura</div><div class="text10 gray">14:20 - 15:05</div></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-10" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-11" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-12" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-13" class="ednevnik-seznam_ur_teden-td "></td><td width="18%" id="ednevnik-seznam_ur_teden-td-9-2019-06-14" class="ednevnik-seznam_ur_teden-td "></td></tr></table>17`;

    const parsed = parseScheduleTable(table);

    expect(parsed.length).toEqual(10);
    parsed.forEach(row => expect(row.length).toEqual(6));
  });

});