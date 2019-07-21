const {parseHomePage, parseArticlePage} = require('./parser');
const moment = require('moment');


describe('News components parser', function () {

  it('should parse single news box (div)', function () {
    const newsDiv =
      `<div id="main-container" class="">
					<div class="row">
<div class="col-cgrid-1 show_desktop"><div class="col-inn-grid col-cbox-1   ">
<div class="widget-container border">
    <div class="widget widget-article">
                    <div class="category dark line c-red no-text">
                                <div class="line-item bc-red"></div>
            </div>
            <div class="clear"></div>
        
        <div class="content">
                            <div class="date">19. 7. 2019</div>
                <div class="clear"></div>
            
            <h4 class="title ">
                Srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol            </h4>
            <div class="clear"></div>

            <div class="description">V Poriju na Finskem je od 15. 7. do...</div>
            <div class="clear"></div>
        </div>

        <div class="bottom-left">
            <a class="main-button arrow read-more" href="http://mic.scng.si/srecanje-upravnega-odbora-evropskega-zdruzenja-poklicnih-in-strokovnih-sol/">
                Preberi več
                <span class="icon c-red"></span>
            </a>
            <div class="clear"></div>
        </div>
    </div>
</div></div><div class="col-inn-grid col-cbox-1   ">
<div class="widget-container border">
    <div class="widget widget-article">
                    <div class="category dark line c-red no-text">
                                <div class="line-item bc-red"></div>
            </div>
            <div class="clear"></div>
        
        <div class="content">
                            <div class="date">16. 7. 2019</div>
                <div class="clear"></div>
            
            <h4 class="title ">
                Bivanje v študentskem domu            </h4>
            <div class="clear"></div>

            <div class="description">Čestitke dijakom, ki se vam je trud obrestoval z...</div>
            <div class="clear"></div>
        </div>

        <div class="bottom-left">
            <a class="main-button arrow read-more" href="http://www.scng.si/bivanje-v-studentskem-domu-2/">
                Preberi več
                <span class="icon c-red"></span>
            </a>
            <div class="clear"></div>
        </div>
    </div>
</div></div></div>`;

    const result = parseHomePage(newsDiv);

    expect(result).toEqual([
      {
        date: expect.any(moment),
        title: 'Srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol',
        href: 'http://mic.scng.si/srecanje-upravnega-odbora-evropskega-zdruzenja-poklicnih-in-strokovnih-sol/'
      },
      {
        date: expect.any(moment),
        title: 'Bivanje v študentskem domu',
        href: 'http://www.scng.si/bivanje-v-studentskem-domu-2/'
      }
    ]);

    expect(result[0].date.toISOString())
      .toEqual(moment('19.7.2019', 'DD.MM.YYYY').toISOString());

    expect(result[1].date.toISOString())
      .toEqual(moment('16.7.2019', 'DD.MM.YYYY').toISOString());
  });

  it('should parse full article page', function () {
    const contentDiv =
      `<div><div id="main-content-container" class="container content-default has-breadcrumbs bt">
			<div class="row">
				<div class="cgrid-table main-table-border">
					<div class="col-cgrid-1 cgrid-cell empty-back pattern-cell">
						<div class="left-pattern col-cbox-2">
							<div class="pattern"
								style="background-image:url(http://mic.scng.si/wp-content/uploads/sites/9/2017/05/MIC-Zastava-61x659.png)">
							</div>
						</div>
					</div>

					<div class="col-cgrid-2 cgrid-cell middle-cell-border">
						<div class="col-cgrid-4 col-cbox-1">

							<div class="widget-container border">
								<div class="widget widget-title">
									<h1 class="title">Srečanje Upravnega odbora evropskega združenja poklicnih in
										strokovnih šol</h1>
									<div class="clear"></div>


									<div class="bottom-left">
										<div class="bottom-line"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="clear"></div>


						<div class="main-content padd color-none">
							<p>V Poriju na Finskem je od 15. 7. do 17. 7. 2019 potekalo srečanje Upravnega odbora
								evropskega združenja poklicnih in strokovnih šol, EUproVET-a, katerega član je, v imenu
								Konzorcija šolskih centrov, tudi Šolski center Nova Gorica. Glavne teme srečanja so
								bile: sistem poklicnega in strokovnega izobraževanja v prihodnjih desetih letih,
								odličnost v poklicnem in strokovnem šolstvu, šole kot vseživljenjski centri znanja,
								izobraževalni računi za odrasle ter umetna inteligenca v izobraževanju. Srečanja se je
								udeležil tudi predstavnik Evropske Komisije g. Joao Santos, pomočnik direktorice
								Direktorata za poklicno in strokovno izobraževanje v Bruslju.</p>
							<p><span style="float: none;background-color: transparent;color: #333333;font-family: Georgia,'Times New Roman','Bitstream Charter',Times,serif;font-size: 16px;font-style: normal;font-variant: normal;font-weight: 400;letter-spacing: normal;line-height: 24px;text-align: left;text-decoration: none;text-indent: 0px;text-transform: none">Adrijana Hodak</span>
							</p>
							<p><img class="alignleft wp-image-3709 size-medium" src="http://mic.scng.si/wp-content/uploads/sites/9/2019/07/PORI-300x161.jpg" alt="" width="300" height="161" srcset="http://mic.scng.si/wp-content/uploads/sites/9/2019/07/PORI-300x161.jpg 300w, http://mic.scng.si/wp-content/uploads/sites/9/2019/07/PORI-768x411.jpg 768w, http://mic.scng.si/wp-content/uploads/sites/9/2019/07/PORI-1024x548.jpg 1024w, http://mic.scng.si/wp-content/uploads/sites/9/2019/07/PORI-1401x750.jpg 1401w" sizes="(max-width: 300px) 100vw, 300px" /></p>
								<p>&nbsp;</p>
								<p>&nbsp;</p>
								<p>&nbsp;</p>
								<p>&nbsp;</p>
								<p>&nbsp;</p>
								<p>&nbsp;</p>
								<div class="clear"></div>
						</div>
					</div>

					<div class="col-cgrid-1 cgrid-cell empty-back">
						<div class="col-cgrid-4 col-cbox-1 hide-widget-mobile">
							<div class="widget-container border">
								<div class="widget widget-empty"></div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div></div>`;

    expect(parseArticlePage(contentDiv)).toEqual({
      title: 'Srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol',
      text: 'V Poriju na Finskem je od 15. 7. do 17. 7. 2019 potekalo srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol, EUproVET-a, katerega član je, v imenu Konzorcija šolskih centrov, tudi Šolski center Nova Gorica. Glavne teme srečanja so bile: sistem poklicnega in strokovnega izobraževanja v prihodnjih desetih letih, odličnost v poklicnem in strokovnem šolstvu, šole kot vseživljenjski centri znanja, izobraževalni računi za odrasle ter umetna inteligenca v izobraževanju. Srečanja se je udeležil tudi predstavnik Evropske Komisije g. Joao Santos, pomočnik direktorice Direktorata za poklicno in strokovno izobraževanje v Bruslju. Adrijana Hodak'
    })
  });

});