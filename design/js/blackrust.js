injectedCustomScripts = false;
bans = [];
bansPagerBuild = false;

var injectingFunction = setTimeout(function() { 
  if(window.jQuery && !injectedCustomScripts) { 
    $('head').append('<script src="//files.rust.black/design/js/pagination.js?v='+cache+'"></script>');
    $('head').append('<script type="text/javascript">!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?160",t.onload=function(){VK.Retargeting.Init("VK-RTRG-354070-fvtnr"),VK.Retargeting.Hit()},document.head.appendChild(t)}();</script><noscript><img src="https://vk.com/rtrg?p=VK-RTRG-354070-fvtnr" style="position:fixed; left:-999px;" alt=""/></noscript>');
    
    items = [];
    $.ajax({
        url: '/files/stores/backend/store.shop.php',
        type: 'POST',
        data: JSON.stringify({"action":"items"}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(msg) {
            if(msg && msg.items) {
              items = msg.items;
            }
        }
    });
    
    function renderBans(page) {
      if(!page) page = 1;   
      
      $.ajax({
          url: 'https://api.rust.black/bans?page=' + page,
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          success: function(bans) {
            if(bans && bans.data && bans.data.length) { 
              waitForEl('img[src="https://files.rust.black/design/images/loader.png"], .bans', function() {
                $('img[src="https://files.rust.black/design/images/loader.png"], .bans').parent('p').css('text-align', 'left').html('<div class="table-wrapper bans">' + 
                  '<div class="table-body">'+
                    '<table class="bans_table table table-striped">'+
                      '<thead><tr>'+
                        '<th width="200">Ник</th>'+
                        '<th>Причина</th>'+
                        '<th width="200">Длительность</th>'+
                      '</thead></tr><tbody></tbody>'+
                    '</table>'+
                  '</div>'+  
                '</div>'  
                );
                
                for(var n in bans.data) { 
                  var ban = bans.data[n];
                  $('.bans_table tbody').append('<tr>'+
                    '<td width="200"><a href="http://steamcommunity.com/profiles/' + ban.steamid + '" target="_blank">' + ban.name + '</a></td>'+
                    '<td>' + ban.reason + '</td>'+
                    '<td width="200">' + ban.expire + '</td>'+
                  '</tr>'  
                  );
                }
                
                if(!bansPagerBuild) {
                  $('img[src="https://files.rust.black/design/images/loader.png"], .bans').parent('p').after('<br /><ul class="bans_pagination"></ul>');
                  $('.bans_pagination').twbsPagination({
                    totalPages: bans.last_page,
                    visiblePages: 5,
                    onPageClick: function (event, goToPage) { 
                      if(bansPagerBuild) renderBans(goToPage);
                    }
                  });
                  
                  bansPagerBuild = true;
                }
              }); 
              
              
            } else {
              waitForEl('img[src="https://files.rust.black/design/images/loader.png"], .bans', function() {
                $('img[src="https://files.rust.black/design/images/loader.png"], .bans').parent('p').html('Список банов пуст');
              });
            }
          }
      });  
    }

    var waitForEl = function(selector, callback) {
    if ($(selector).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForEl(selector, callback);
      }, 100);
    }
  };
    
    $(".colqq").mouseover(function() {
      if($(this).find('.product__name:contains("Black")').length) $(this).find('img').addClass('glowing-black');
      else $(this).find('img').addClass('glowing');
    });
    
    $(".colqq").mouseout(function() {
      $(this).find('img').removeClass('glowing');
      $(this).find('img').removeClass('glowing-black');
    });
    
    $("body").on("mouseover", ".roulette_item", function() {
      $(this).find('.product__name').addClass('slidedown');
    });
    
    $("body").on("mouseout", ".roulette_item", function() {
      $(this).find('.product__name').removeClass('slidedown');
    });
    
    $("body").on("click", "li[role]", function() {
      var banned = $(this).find('a[href*="banned"]');  
      
      if(banned.length) renderBans(1);
      else bansPagerBuild = false;
    });
    
    purchase_Link = false;
    
    
    $("body").on("click", ".colqq:not('.roulette_item')", function() { 
      $('.roulette-item__description').remove();
      if(items.length) {
        $('.roulette__description:first').html('');  
      }
      
      waitForEl('.service__image', function() {
        $(".service__image").addClass('animated fadeInDown');
      }); 
      
      waitForEl('.roulette__railway', function() {
        $(".roulette__railway").addClass('animated bounceInRight slower');
      }); 
            
      var rouleteItem = [];
      for(var k in items) {
        if(items[k].name == $(this).find('.product__name').text()) {
          rouleteItem = items[k];
          break;
        }
      }
      
      if(rouleteItem.items) { 
        var description = '<h4 class="roulette__items__description">Может выпасть:</h4><div class="row roulette__items__description">';
        for(var z in rouleteItem.items) {
          var item = rouleteItem.items[z];
          description += '<div class="colqq roulette_item col-xs-4 col-md-2 col-lg-2">'+
                           '<div class="product">'+
                              '<img class="product__image" src="'+item.img+'">'+
                              '<div class="product__name">'+
                                  item.name;
          if(item.minRandomAmount != item.amount) description += '<br /><b>x'+item.minRandomAmount+'-x'+item.amount+'</b>';
          else description += '<br /><b>x'+item.amount+'</b>';                  
          description +=  '</div>'+
                            '</div>'+
                          '</div>';
        }
        description += '</div>';
        
        waitForEl('.roulette__description', function() {
          $('.roulette__description:first').html(description);
          $('.roulette__description:first').addClass('animated fadeInDown');
        }); 
        
        waitForEl('.roulette_item', function() {
          //$(".roulette_item").addClass('animated fadeInDown slow');
        }); 
        
        waitForEl('.roulette-item__description', function() { 
          $('.roulette-item .roulette-item__description:contains("(УНИКАЛЬНО)")').each(function() {
            $(this).find('h4').text($(this).find('h4').text().replace('(УНИКАЛЬНО)', ''));
            $(this).append("<div class='product__unique'>УНИКАЛЬНО</div>");
          });
        });
        
        waitForEl('.roulette', function() { 
          //var el = $('input[ng-value="$ctrl.finalPrice"]').closest('.row');
          //el.hide();
          //el.find('.col-md-12').removeClass('col-md-12');
          //el.find('.col-md-9').after('<div class="col-md-3 purchase_button"></div>')
          //$('a[ng-click="$ctrl.purchase()"]').removeClass('pull-right').text('Испытать удачу (' + $('input[ng-value="$ctrl.finalPrice"]').val() + ' RUB)');
          //$('.roulette').after('<div class="row purchase_button"><br /></div>');
          //$('.purchase_button').append($('a[ng-click="$ctrl.purchase()"]'));
          //$('.roulette').after(el);
        });        
        
        waitForEl('.modal.in', function() {
          var el = $('input[ng-value="$ctrl.finalPrice"]').closest('.row');
          if(!purchase_Link)purchase_Link = $('a[ng-click="$ctrl.purchase()"]').clone(true);
          
          $('.modal-footer div').find('a[ng-click="$ctrl.purchase()"]').addClass('purchase_Button_Original');
          
          if($('.modal-body').find('.roulette').length !== 0) { 
            $('.modal-footer div').find('a[ng-click="$ctrl.purchase()"]').hide();
            el.hide();
            $('.purchase_button').remove();
            purchase_Link.removeClass('pull-right').text('Испытать удачу (' + $('input[ng-value="$ctrl.finalPrice"]').val() + ' RUB)').addClass('purchase_Handler');
            $('.roulette').after('<div class="row purchase_button"><br /></div>');
            $('.purchase_button').append(purchase_Link);
          } else {
            el.show();
            $('.modal-footer div').find('a[ng-click="$ctrl.purchase()"]').show();
          } 
        }); 
        
      }
    });
    
    $('body').on('click', '.purchase_Handler', function() { 
      angular.element(document.querySelector('.purchase_Button_Original')).triggerHandler('click');
    });
    
    $('body').on('mouseover', '.social_widget img', function() { 
      $(this).removeClass('rotateIn heartBeat').addClass('heartBeat');
    });
    
    $('body').on('mouseout', '.social_widget img', function() { 
      $(this).removeClass('rotateIn heartBeat');
    });
    
    $('img[src="https://files.rust.black/design/images/loader.png"]').addClass('animated rotateIn infinite');
    
    if(location.hash == '#/app/page/banned') {
      setTimeout(function() {
        renderBans(1);
      }, 500);
    }
    
    injectedCustomScripts = true;
  }
  
  if(injectedCustomScripts) clearTimeout(injectingFunction);
}, 500);