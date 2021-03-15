exports.matMulPage = (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send('<!DOCTYPE html><html><body><h2>Matrix Multiplication:</h2><form action="/matMul" method="post">  <label for="matMul">No of iterations:</label><br>  <input type="number" id="mulVal" name="mulVal" value="2"><br>  <input type="submit" value="Submit"></form> <p>Data will be presented on a new page.</p></body></html>')
}

//Perform matmul service
exports.performMatMul = (req, res) => {
    result = ''
    console.log("Calling Java program... with mul value: " + req.body.mulVal)
    let childProcess = require('child_process').spawn(
        'java', ['MatMul', req.body.mulVal]
    );
  
    childProcess.stdout.on('data', function(data) {
        result += JSON.stringify(data).replace('{"type":"Buffer","data":','\n')
    });
    
    childProcess.stderr.on("data", function (data) {
        result = JSON.stringify(data);
    });

    childProcess.on('close', (code) => {
        console.info('Exiting Java program...')
        res.status(200).send(result + '\n\n\nEnded with code: ' + code)
      });
}