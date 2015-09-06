from flask import Flask, request, render_template, jsonify
from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter
import code
import io
import sys

app = Flask(__name__)
console = code.InteractiveConsole()
console.push('import sys')
prefix = ''

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/exec/')
def run():
    if request.args:
        if 'exec' in request.args.keys():
            global prefix
            global console
            command = request.args['exec']
            print(command)
            output = io.StringIO()
            old_stdout = sys.stdout
            old_stderr = sys.stderr
            sys.stdout = sys.stderr = output
            try:
                execute = console.push(command)
            finally:
                sys.stdout = old_stdout
                sys.stderr = old_stderr
            output = output.getvalue()
            if not prefix:
                prefix = '>>> '
            result = prefix + command + '\n' + output
            code = highlight(result, PythonLexer(), HtmlFormatter())
            if execute:
                prefix = '... '
            else:
                prefix = '>>> '
            return jsonify(command=command,
                           execute=output,
                           prefix=prefix,
                           code=code)
        if 'restore' in request.args.keys():
            if request.args['restore']:
                console = code.InteractiveConsole()
                return jsonify(restored=True)
            else:
                return jsonify(restored=False)
        else:
            return jsonify(error=True)
    else:
        return jsonify(error=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
