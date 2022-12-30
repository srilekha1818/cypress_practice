

    describe('Tests with backend', () => {

      beforeEach ('login to application', () => {
        cy.intercept("GET", "**/tags", { fixture: "tags.json" });


        cy.loginToApplication()
      })

      it('verify correct request and response', () => {

        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles')

        cy.contains( 'New Article').click()

        cy.get('[formcontrolname="title"]').type('This is the srilekha169 title')
        cy.get('[formcontrolname="description"]').type("This is a descritption")

        cy.get('[formcontrolname="body"]').type('This is a body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then( xhr => {
        console.log(xhr)
        expect(xhr.response.statusCode).to.equal(200)
        expect(xhr.request.body.article.body).to.equal('This is a body of the article')
        expect(xhr.response.body.article.description).to.equal('This is a descritption')

        })


})
it('verify popular tags are displayed', () => {
  cy.get('.tag-list')
.should('contain', 'introduction') .and('contain', 'automation')
.and('contain', 'srilekha')

 })
 it('verify global feed likes count', () => {

  cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', {"articles":[],"articlesCount":0})

  cy.intercept('GET', 'https://api.realworld.io/api/articles*', { fixture: 'articles.json'})

  cy.contains('Global Feed').click()
  cy.get('app-article-list button').then(heartList => { expect (heartList[0]).to.contain ('4')

  expect(heartList [1]).to.contain ('5')

  })

  cy.fixture('articles').then(file => {
    const articleLink = file.articles [1].slug

  file.articles [1]. favoritesCount = 6

  cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articleLink+'/favorite', file)
  })

  cy.get('app-article-list button').eq(1).click().should('contain', '6')

  })
  it('intercepting & modifying the request and response', () => {

    cy.intercept('POST', "**/api.realworld.io/api/articles" , (req) => {
      req.reply( res => {
        expect(res.body.article.description).to.equal('This is a description')
         res.body.article.description="This is a descritption 2"
      })

    }).as('postArticles')

    cy.contains( 'New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title 398')
    cy.get('[formcontrolname="description"]').type("This is a description")
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then( xhr => {
    console.log(xhr)
    expect(xhr.response.statusCode).to.equal(200)
    expect(xhr.request.body.article.body).to.equal('This is a body of the article')
    expect(xhr.response.body.article.description).to.equal('This is a descritption 2')

    })


})

it('Delete new article in the global feed via API', () => {
  const bodyRequest = {
      "article": {
          "tagList": [],
          "title": "Request from Api148",
          "description": "awesome",
          "body": "Angular14 is awesome"
      }
  }

  cy.get('@token').then(token=> {
      cy.request({
          url: 'https://api.realworld.io/api/articles/',
          headers: {'Authorization': 'Token ' + token},
          method: 'POST',
          body: bodyRequest
      }).then(response => {
          expect(response.status).to.equal(200)
      })

      cy.contains('Global Feed').click()
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()
      cy.wait(500)


      cy.request({
          url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
          headers: {'Authorization': 'Token ' + token},
          method: 'GET'
      }).its('body')
          .then( body => {
              expect(body.articles[0].title).to.not.include('Request from Api148')

  })
  })
})


    })
