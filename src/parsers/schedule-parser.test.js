const fetch = require('node-fetch');
const {
  parseScheduleTopRow,
  parseTimeTableData,
  parseLessonTableData,
  parseScheduleRow,
  parseScheduleTable,
  parseClasses
} = require('./schedule-parser').test;

describe('Parse classes selection box', function () {

  it('should parse class names and ids', async function () {
    let schedulePage = await fetch('https://www.easistent.com/urniki/e29aeb36cd1efde89c2b2c28e33209813ec32756')
      .then(res => res.text());

    expect(parseClasses(schedulePage).length).toEqual(22)
  });

});

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
        type: 'normal',
        fullName: 'Angleščina',
        shortName: 'ANG',
        teacher: 'R. Češčut',
        classRoom: 'E36',
        group: ''
      }
    ]);
  });

  it('should lesson table data with "Praznik" content', function () {
    const td =
      `<td width="18%" id="ednevnik-seznam_ur_teden-td-0-2019-08-15" class="ednevnik-seznam_ur_teden-td ">
			<div class="ednevnik-seznam_ur_teden-urnik ednevnik-seznam_ur_teden-td-dogodek " style="color:#444;">					<table class="w100 collapse" title="Šolski koledar">
					<tbody><tr>
						<td style="border:none;" class="text14 bold">
						Praznik						</td>
						<td style="border:none;" align="right"><img src="https://www.easistent.com/images/icons/ednevnik_seznam_ur_dogodek.png" title="Šolski koledar"></td>
					</tr>
					</tbody></table>
									</div>
							</td>`;

    expect(parseLessonTableData(td)).toEqual([{
      type: 'other',
      fullName: 'Praznik',
      shortName: '',
      teacher: '',
      classRoom: '',
      group: ''
    }])
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
        type: 'normal',
        fullName: 'Izdelava osnovnih vezij - praksa',
        shortName: 'IOVp',
        teacher: 'V. Jug',
        classRoom: 'M1-07',
        group: '1'
      },
      {
        type: 'normal',
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
          type: 'normal',
          fullName: 'Angleščina',
          shortName: 'ANG',
          teacher: 'R. Češčut',
          classRoom: 'E36',
          group: ''
        }
      ],
      [
        {
          type: 'normal',
          fullName: 'Umetnost',
          shortName: 'UME',
          teacher: 'S. Peršolja Bučinel',
          classRoom: 'E33',
          group: ''
        }
      ],
      [],
      [
        {
          type: 'normal',
          fullName: 'Umetnost',
          shortName: 'UME',
          teacher: 'S. Peršolja Bučinel',
          classRoom: 'E31',
          group: ''
        }
      ],
      [
        {
          type: 'normal',
          fullName: 'Izdelava osnovnih vezij - praksa',
          shortName: 'IOVp',
          teacher: 'V. Jug',
          classRoom: 'M1-07',
          group: '1'
        },
        {
          type: 'normal',
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

});

describe('Tests with network request data', function () {

  it('should table full schedule table without lessons', async function () {
    const table = await fetch('https://www.easistent.com/urniki/ajax_urnik', {
      method: 'POST',
      body: 'id_sola=224&id_razred=343294&id_dijak=0&teden=43&qversion=17',
      headers: { 'Content-Type': `application/x-www-form-urlencoded` }
    }).then(res => res.text());

    const parsed = parseScheduleTable(table);

    expect(parsed.length).toEqual(11);
    parsed.forEach((row, i) => i > 0 ? expect(row.length).toEqual(6) : null);
  });

  it('should parse full schedule table with lessons', async function () {
    const table = await fetch('https://www.easistent.com/urniki/ajax_urnik', {
      method: 'POST',
      body: 'id_sola=224&id_razred=343294&id_dijak=0&teden=39&qversion=17\'',
      headers: { 'Content-Type': `application/x-www-form-urlencoded` }
    }).then(res => res.text());

    const parsed = parseScheduleTable(table);

    expect(parsed.length).toEqual(11);
    parsed.forEach((row, i) => i > 0 ? expect(row.length).toEqual(6) : null);
  });

});
