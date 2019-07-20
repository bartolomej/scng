const {fetchLiveArticles, fetchArticle, updateArticles, init} = require('../index');


describe('Article module tests', function () {

  it('should extract article descriptions', async function () {
    let articles = await fetchLiveArticles();

    expect(articles.length).toEqual(4);
  });

  it('should pare article page', async function () {
    let article = await fetchArticle('https://mic.scng.si/srecanje-upravnega-odbora-evropskega-zdruzenja-poklicnih-in-strokovnih-sol/');

    expect(article).toEqual({
      title: 'Srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol',
      text: 'V Poriju na Finskem je od 15. 7. do 17. 7. 2019 potekalo srečanje Upravnega odbora evropskega združenja poklicnih in strokovnih šol, EUproVET-a, katerega član je, v imenu Konzorcija šolskih centrov, tudi Šolski center Nova Gorica. Glavne teme srečanja so bile: sistem poklicnega in strokovnega izobraževanja v prihodnjih desetih letih, odličnost v poklicnem in strokovnem šolstvu, šole kot vseživljenjski centri znanja, izobraževalni računi za odrasle ter umetna inteligenca v izobraževanju. Srečanja se je udeležil tudi predstavnik Evropske Komisije g. Joao Santos, pomočnik direktorice Direktorata za poklicno in strokovno izobraževanje v Bruslju. Adrijana Hodak'
    });
  });

  it('should update articles', async function () {
    await init();
    await updateArticles();
  });

});