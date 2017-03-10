<html>

<head></head>

<body>
  <p id="text">socket.io</p>

  <script src="socket.io/socket.io.js"></script> 
  <script src="jquery-1.6.1.min.js"></script><!-- Downloaded Jquery -->

  <script> 
      $(document).ready(function(){

          var socket  = new io.Socket(),
                  text        = $('#text');

          socket.connect();

          socket.on('connect', function () {
              text.html('connected');
          });

          socket.on('message', function (msg) {
              text.html(msg);
          });

          socket.on('disconnect', function () {
              text.html('disconnected');
          });

      });
  </script>
</body>

</html>

