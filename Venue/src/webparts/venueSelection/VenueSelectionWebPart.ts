import { Version,Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
require("bootstrap");
import{SPComponentLoader} from '@microsoft/sp-loader'; 
import styles from './VenueSelectionWebPart.module.scss';
import * as strings from 'VenueSelectionWebPartStrings';
import pnp from "sp-pnp-js"
import { IDigestCache, DigestCache } from '@microsoft/sp-http';

export interface IVenueSelectionWebPartProps {
  description: string;
}

export default class VenueSelectionWebPart extends BaseClientSideWebPart<IVenueSelectionWebPartProps> {

  public render(): void {
    let cssurl="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssurl);

    this.domElement.innerHTML = `
      <div class="${ styles.venueSelection }">
        <div class="${ styles.container }">
         
        <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>Venue</th>
            <th>JustVote</th>
          
          </tr>
        </thead>

        <tbody id="VD">
            
          <tr class="success">
                     
          </tr>
        </tbody>
      </table>

      <div id="piechart"></div>
         
        </div>
      </div>`;

      this.GetVenue();
  }
  private GetVenue() {
    var CurrUserName=  this.context.pageContext.user.email;
    alert("currentuser"+CurrUserName);
    var curl = this.context.pageContext.web.absoluteUrl;
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#test').innerHTML = "sorry this does not work in local workbench";
    }

    else {
   


      var call = $.ajax({

      

        //?$top=1$select=ID,Title&$filter=(Expires ge datetime'" + d + "')&$orderby=Expires desc"
        url: curl + "/_api/web/lists/getByTitle('rajeshvenueinfo')/Items/?$select= Id,Title",
        type: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });
      call.done(function (data,textStatus,jqXHR) {
   
         var venuedata = $("#VD");
         var trclass=$(".success");
         // var Active;
      
         $.each(data.d.results, function (index,value) {
           alert(value.title);
         venuedata.append("<tr class='"+trclass+"'><td bgcolor='#3F729B'> <h3>"+value.Title+" </td><td><button id= "+value.Id+ " type='button' class='btn btn-primary active' data-toggle='modal' data-target='#myModal'>Vote</button></td><br/></tr>");  

      
        }); 


        });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });

        $(document).on("click", ".btn" , function(event) {
          
          var fired_button = $(this).attr("Id");
          alert(fired_button);
          // alert(fired_button);

          //  var button = $(event.relatedTarget) ; 
          //  alert(button);
         
           $(".btn").removeClass('active').addClass('disabled');
        //   // alert(button);
        $('#'+fired_button).removeAttr('class');
        $('#'+fired_button).addClass('active btn btn-primary');

        


//------------------------------------------------post------------------------------------------

       
          // var call = jQuery.ajax({
          //     url: curl + "/_api/Web/?$select=Title,CurrentUser/Id&$expand=CurrentUser/Id",
          //     type: "GET",
          //     dataType: "json",
          //     headers: {
          //         Accept: "application/json;odata=verbose"
          //     }
          // });
          // call.done(function (data, textStatus, jqXHR) {
          //     var userId = data.d.CurrentUser.Id;
          //     var username=data.d.CurrentUser.email;
          //     alert(username);

          //     addItem(userId);
          // });
          // call.fail(function (jqXHR, textStatus, errorThrown) {
          //     failHandler(jqXHR, textStatus, errorThrown);
          // });
      
         // function addItem() {
              // var due = new Date();
              // due.setDate(due.getDate() + 7);
             
           
          //     var call = jQuery.ajax({

          //         url: curl+"/_api/Web/Lists/getByTitle('rajeshvoteinfo')/Items",
          //         type: "POST",
          //         data: JSON.stringify({
          //             "__metadata": { type: "SP.Data.rajeshvoteinfoListItem" },
          //             Title: CurrUserName,
          //             VenueLookup:fired_button
          //             //AssignedToId: userId,
          //            //DueDate: due
          //         }),
          //         headers: {
          //             Accept: "application/json;odata=verbose",
          //             "Content-Type": "application/json;odata=verbose",
          //             "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                      
          //             "IF-MATCH": "*",
          //       "X-HTTP-Method": "MERGE",
          //         }
          //     });
          //     call.done(function (data, textStatus, jqXHR) {
          //         //var div = jQuery("#message");
          //         alert("Item added");
          //     });
          //     call.fail(function (jqXHR, textStatus, errorThrown) {
          //         failHandler(jqXHR, textStatus, errorThrown);
          //     });
          // //}
      
          // function failHandler(jqXHR, textStatus, errorThrown) {
          //     var response = JSON.parse(jqXHR.responseText);
          //     var message = response ? response.error.message.value : textStatus;
          //     alert("Call failed. Error: " + message);
          // }
      
   
        //pnp.sp.web.lists.getByTitle("VenueLookup").items.add
        pnp.sp.web.lists.getByTitle('rajeshvoteinfo').items.add({   

          Title :CurrUserName,
          VenueLookupId :fired_button
         });
            



 //          button.removeClass('disabled').addClass('active'); 
        //  alert("sasa");
        });


      //   $(document).on("click", ".btn" , function() 
      // {
      //     if(this.cli){
      //         $(this).css('background-color', 'red');
      //         clicked  = false;
      //     } else {
      //         $(this).css('background-color', 'blue');
      //         clicked  = true;
      //     }   
      // });




        
      //   var call = $.ajax({
      //     url: curl + "/_api/web/lists/getByTitle('Managers Speaks')/Items/?$select= Id,ImageUrl,Subject,Description&$filter=(Id eq '"+id+"')",
      //     type: "GET",
      //     dataType: "json",
      //     headers: {
      //       Accept: "application/json;odata=verbose"
      //     }
      //   });
      //   call.done(function (data) {
      //    // alert("sucess");

      //     $.each(data.d.results, function (index, value) {
      //      //alert(value.Subject);
      //      $("#dispc").empty();
      //      var message = $("#dispc");
      //      message.append(`
      //     <div class="modal-header">
      //     <button type="button" class="close" data-dismiss="modal">&times;</button>
      //     <h4 class="modal-title">${value.Subject}</h4>
      //   </div>
      //   <div class="modal-body">
      //   <div>
      //   <img src='${value.ImageUrl}' alt="Oops Not Displayed" style="width:100%;" />
      //         <p>${value.Description}</p>
      //   </div>
      //   <div>
      //   <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

      //   </div>
      //   </div>
           
           
      //      `)


      //     });



      //   });
      //   call.fail(function (jqXHR, textStatus, errorThrown) {
      //     var response = JSON.parse(jqXHR.responseText);
      //     var message = response ? response.error.message.value : textStatus;
      //     alert("Call failed. Error: " + message);
      //   });
      // });


       }
  }

 
    
  

  



  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
