
import $ from 'jquery'

export default function docStyler(doc){

          $("[rend=struck-through]",doc).addClass( "struckThrough" );
          $("[rend=struck-through]",doc).each(function() {
              var text = $(this).text();
              $(this).text("[CANCELLED "+text.trim()+"]");
          });

          // add square brackets and CANCELLED string to <del>
          $("span.del",doc).each(function() {
              var text = $(this).text();
              $(this).text("["+text.trim()+"]");
          });

          // add square brackets to <supplied>. or <span class="supplied"> if you prefer.
          // $("span.supplied",doc).each(function() {
          //     var text = $(this).text() ;
          //     $(this).text("["+text.trim()+"]");
          // });

          // This one hides the <sic> inside a <choice> block if <corr> is present.
          $("span.sic",doc).each(function() {
              var text = $(this).text();
              $(this).text("["+text.trim()+"]");
              var next = $(this).next()
              if ( next.hasClass("corr") ){
                $(this).css("display","none")
              }
          });

          // Add space after <forename>

          $("span.forename",doc).after("&nbsp;");

          $("span.supplied",doc).addClass( "removeMargin" ) //.css("margin-Left:-1px; margin-Right:-1px")

          $("span.note[resp=arber]",doc).each(function() {
              var text = $(this).text() ;
              $(this).text("["+text.trim()+"]");
          });

          $("span.persName[role~=enterer]",doc).css( "font-weight", "bold" )
          $("span.persname[role~=enterer]",doc).css( "font-weight", "bold" )

}
