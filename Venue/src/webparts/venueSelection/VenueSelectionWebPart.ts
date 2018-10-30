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
import pnp, { Items, AlreadyInBatchException } from "sp-pnp-js";
import Chart from 'chart.js';
import {GoogleCharts} from 'google-charts';

import { IDigestCache, DigestCache, ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import { Thread } from 'sp-pnp-js/lib/graph/conversations';

export interface IVenueSelectionWebPartProps {
  description: string;
}
var fired_button;
var loacationvotelist=new Array();
var locationlist=new Array();
var locationname=new Array();
var curl1;

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
      <diV>
      <h4><span class="label label-success" id="warningmessage"></span></h4>
      <h4><span class="label label-danger" id="warningmessage1"></span></h4>
      <button type="button" class="submitvenue" style="background-color: #4CAF50;padding: 15px 32px; text-align: center;text-decoration: none;display: inline-block;font-size: 16px; color: white;">Submit Vote</button>
      </div>

     <h2> <div id="chart1"></div></h2>
       <canvas id="doughnut-chart" width="800" height="450"></canvas>
      </div>
      </div>`;
       curl1=this.context.pageContext.web.absoluteUrl;
this.GetVenue(this.GetPieChart,this.PieChartDisplay);
this.GetPieChart(this.PieChartDisplay);   
  }
  // method for pie chart------------------------------------------------------------------------
private GetPieChart(piechartdisplay1){
//alert("Get Pie Chart Enterd");

//************used before(its working)-----------------------------****//
// alert("piechartenterd");
// alert("form updation");
// var hyderabadcount=0;
// var vizagcount=0;
// var vijayawadacount=0;
// var banagalorecount=0;
//var goacount=0;
var call = $.ajax({
        url: curl1+"/_api/web/lists/getByTitle('rajeshvoteinfo1')/Items?$select=Title,VenueLocation",
        type: "GET",
        dataType: "json",
        headers: {
         Accept: "application/json;odata=verbose"
        }
      });
      call.done(function (data,textStatus,jqXHR) {
       // alert("how long "+locationlist.length);
       loacationvotelist.length=0;
        for(var i=0;i<locationlist.length;i++)
        {
          var countttt= data.d.results.filter(value => value.VenueLocation === locationlist[i].Title).length;
         // alert("countttt "+countttt)
         loacationvotelist  .push(data.d.results.filter(value => value.VenueLocation === locationlist[i].Title).length);
        }

  //  $.each(data.d.results, function (index,value) {
  //   if(value.VenueLocation==locationlist[0]){
  //   vizagcount++;
  //   }
  //    if(value.VenueLocation==locationlist[1]){
  //     goacount++;
  //         }
  //     if(value.VenueLocation==locationlist[2]){
  //     banagalorecount++;
  //         }
  //      if(value.VenueLocation==locationlist[3]){
  //     vijayawadacount++;
  //         }
  //         if(value.VenueLocation==locationlist[4]){
  //     hyderabadcount++
  //         }
  //      }); 
        // alert(vizagcount);
        // alert(goacount);
        // alert(banagalorecount);
        // alert(vijayawadacount);
        // alert(hyderabadcount);
        // loacationvotelist.push(vizagcount);
        // loacationvotelist.push(goacount);
        // loacationvotelist.push(banagalorecount);
        // loacationvotelist.push(vijayawadacount);
        // loacationvotelist.push(hyderabadcount);
        piechartdisplay1();//function for piechart displaying with loaded data
                });
  call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });
}

public PieChartDisplay(){

  //alert(loacationvotelist);

   // alert("Display Pie Chart Entered");
    new Chart(document.getElementById("doughnut-chart"), {
      type: 'doughnut',
      data: {
        labels: locationname,
        datasets: [
          {
            data: loacationvotelist,
            backgroundColor: ["#37474F", "#9933CC","#212121","#00695c","#CC0000"] 
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Votes submitted for each Loaction'
        }
      }
  });
}
//private GetVenue() method for Getting all the Location and Votes Details
  private GetVenue(callpiechart,callpiechartdisplay)
  {
   // alert("Get Venue Enterd")
    var CurrUserName=  this.context.pageContext.user.email;
    //alert("currentuser"+CurrUserName);
    var curl = this.context.pageContext.web.absoluteUrl;
    var context=this.context;
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
   //alert("Display locaton data and Buttons");
         var venuedata = $("#VD");
         var trclass=$(".success");
         // var Active;
         locationlist = data.d.results;
         $.each(data.d.results, function (index,value) {
         //  alert(value.title);
         venuedata.append("<tr class='"+trclass+"'><td bgcolor='#3F729B'> <h3>"+value.Title+" </td><td><button id= "+value.Title+ " type='button' class='btn btn-primary active' data-toggle='modal' data-target='#myModal'>Vote</button></td><br/></tr>");  
       locationname.push(value.Title);
      // alert(locationname);         
        }); 
        });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });
//-------------------------------------user validation-------------------------------------------
var call = $.ajax({
  url: curl + "/_api/web/lists/getByTitle('rajeshvoteinfo1')/Items/?$select= Title,VenueLocation,ID&$filter=(Title eq '"+ CurrUserName+"')",
  type: "GET",
  dataType: "json",
  headers: {
    Accept: "application/json;odata=verbose"
  }
});
call.done(function (data,textStatus,jqXHR) {
  //alert("for user validation entered");
  var test:boolean=true;
   $.each(data.d.results, function (index,value) {
    var label1 = $('#warningmessage1');
    var label2=$('warningmessage')
  //  alert(value.Title);
  //  alert(value.ID);
  //  alert(value.VenueLocation)
   if(CurrUserName===value.Title){
    // alert("User existed")
setTimeout(() => {
 $(".btn").removeClass('active').addClass('disabled');
      //   // alert(button);
$('#'+value.VenueLocation).removeAttr('class');
$('#'+value.VenueLocation).addClass('active btn btn-primary');
  label2.text("You already Voted For "+value.VenueLocation);
    }, 200);
// submit button to update the vote 
$(document).on("click", ".submitvenue" , function(event) {
//alert(" do you want to update");
//alert("submit");
pnp.sp.web.lists.getByTitle('rajeshvoteinfo1').items.getById(value.ID).update({       
  Title :CurrUserName,
  VenueLocation :fired_button
}).then(()=> {
  // alert("updated");
  // label1.text("vote for "+fired_button+"Updated");   
  // setTimeout(() => {
  //   window.location.reload();
  // }, 500);
  callpiechart(callpiechartdisplay)
  });          
});
      test=false;
   } 
   else{
   }
  }); 
if(test)
   {
alert("New User Please Enter The Vote");
     var label = $('#warningmessage');
  //-------------------------Click on submit to add the vote------------------------------
     $(document).on("click", ".submitvenue" , function(event) {
      pnp.sp.web.lists.getByTitle('rajeshvoteinfo1').items.add({   
      Title :CurrUserName,
      VenueLocation :fired_button
    }).then(()=> {
  
      callpiechart(callpiechartdisplay)
      window.location.reload();
      
    });

    });
   }

  });

call.fail(function (jqXHR, textStatus, errorThrown) {
  var response = JSON.parse(jqXHR.responseText);
  var message = response ? response.error.message.value : textStatus;
  alert("Call failed. Error: " + message);
});


//------------  vote button functionality-------------------------------------------------------

  $(document).on("click", ".btn" , function(event) {
         // alert("first Button entered");
   fired_button = $(this).attr("Id");
         // alert(fired_button);
   $(".btn").removeClass('active').addClass('disabled');
        //   // alert(button);
   $('#'+fired_button).removeAttr('class');
  $('#'+fired_button).addClass('active btn btn-primary');
});
    }}
//------------------------------------------------Topost[Tried]------------------------------------------
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
        //button.removeClass('disabled').addClass('active'); 
        //  alert("sasa");
      
   // code for submit vote------------------------------- [working]    
        
        // $(document).on("click", ".submitvenue" , function(event) {
        //         alert("Location is : "+fired_button);
        //         const subvote: ISPHttpClientOptions = 
        //         {
        //           body:`{ VenueLocation:'${fired_button}',Title:'${CurrUserName}'}`
       //        };
        //        var url1=curl+"/_api/web/lists/getByTitle('rajeshvoteinfo1')/Items";
        //        context.spHttpClient.post(
        //          url1,SPHttpClient.configurations.v1,subvote)
        //          .then((Response:SPHttpClientResponse)=>
        //          {
        //            console.log("After creation response",Response);

        //            Response.json().then((responseJSON:JSON)=>{

        //             console.log("JSON",responseJSON);
        //            });

        //            if(Response.ok){
        //              alert("Item added");
        //            }

        //          })
        //          .catch((error: SPHttpClientResponse) => {
        //           console.log(error);
        //           return;
        //         });
            
        //       }
              
        //   )};
            
        //     }     


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
