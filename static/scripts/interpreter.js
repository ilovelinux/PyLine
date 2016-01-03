var cmd = [];
var number = 0;
function write_output(text, overwrite) {
    if (overwrite) {
        $('#output').html(text);
    }
    else {
        $('#output').html($('#output').html() + text);
    }
}
$(function() {
    $("#interprete").keypress(function(e){
        if (e.keyCode == 13 || e.which == 13) {
            var text = $('#interprete').val();
            $('#interprete').val('');
            cmd.push(text);
            number = Math.max(cmd.length-1, 0);
        if (text == 'source' || text == 'src') {
        write_output('<div class="highlight"><span class="ow">Source: https://bitbucket.org/ilovelinux/pyline/</span></div>');
        }
        else if (text == 'resetall') {
                $.getJSON(document.location.origin+"/exec/", {"restore":"True"}, function(json){
                    if (json.restored) {
                    cmd = [];
                    number = 0;
                    write_output('<div class="highlight"><span class="ow">Restored: ' + json.restored + '</span></div>', true);
                    }
                });
            }
        else if (text == 'about') {
            $.getJSON(document.location.origin+"/exec/", {"exec":"sys.version.split()[0]"}, function(json){
                var version = json.execute.replace("'", "").replace("'", "");
                write_output('<div class="highlight"><span class="ow">Author: Antonio Spadaro < antoniospadaro45 AT gmail DOT com ><br>Source: https://bitbucket.org/ilovelinux/pyline/<br>Based on Python '+version+'</span></div>');
            });
        }
            else {
                $.getJSON(document.location.origin+"/exec/", {'exec':text}, function(json){
                    write_output(json.code);
                    $('#prefix').text(json.prefix);
                });
            }
        }
    });
    $("#interprete").keydown(function(e){
        if (e.which == 38) {
            $('#interprete').val(cmd[number]);
            number = Math.max(number-1, 0);
        }
        if (e.which == 40) {
            number = Math.min(number+1, cmd.length-1);
            $('#interprete').val(cmd[number]);
        }
    });
});
