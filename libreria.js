
                var map;
                var myLatlng;
                var marker ;
                var json;
                var tBusqueda;
                var lon1 ;
                var lat1
                var neighborhoods = [
                                    {lat: -11.976837, lng: -77.046540},
                                    {lat: -11.938837, lng: -77.071540},
                                    {lat: -12.890837, lng: -77.097540},
                                    {lat: -11.970837, lng: -77.099540}
                ];
                var markers1 = [];
                //var image = 'btc_buscar.gif';

                $( document ).ready(function() {                         
                         tBusqueda="";
                         json = JSON.stringify(mRetornarJSONUbigeo());
                         json = jQuery.parseJSON(json).ubigeo.department;
                          $('#departamento,#provincia,#distrito').append($('<option>',
                             {
                                value: 0,
                                text : "SELECCIONE"
                            }));
                          for (i = 0; i < json.length; i++) {
                            $('#departamento').append($('<option>',
                             {
                                value: json[i].name.toUpperCase(),
                                text : json[i].name.toUpperCase()
                            }));
                          }
                          CargarCombosStorage();
                    });


                //animcacion del marcador
                function initMap() {
                  lon1 = localStorage.getItem("Longitud");                  
                  lat1 = localStorage.getItem("Latitud");

                  if(lon1==null)
                  {
                    myLatlng = new google.maps.LatLng(-11.976837,-77.046540);
                  }else
                  {
                    myLatlng = new google.maps.LatLng(lat1,lon1);
                  }
                  
                  map = new google.maps.Map(document.getElementById('map'), {
                    center: myLatlng,
                    zoom: 17,
                  });




                  marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: 'Description of my house!',
                        animation: google.maps.Animation.DROP,
                        position: myLatlng,
                        //icon: image,
                        draggable:true, //habilitar que el marcador se pueda mover
                      });

                      marker.setMap(map);
                      //marker.addListener('click', toggleBounce); efecto movimiento
                    }

                  //function para el efecto movimiento
                  function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                      marker.setAnimation(null);
                    } else {
                      marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                  }

                  //funciones para hacer el efecto de caida
                  function drop() {
                    clearMarkers();
                    for (var i = 0; i < neighborhoods.length; i++) {
                      addMarkerWithTimeout(neighborhoods[i], i * 300);
                    }
                  }

                  function addMarkerWithTimeout(position, timeout) {
                    window.setTimeout(function() {
                      markers1.push(new google.maps.Marker({
                        position: position,
                        map: map,
                        //icon: image,
                        animation: google.maps.Animation.DROP
                      }));
                    }, timeout);
                  }

                  function clearMarkers() {
                    for (var i = 0; i < markers1.length; i++) {
                      markers1[i].setMap(null);
                    }
                    markers1 = [];
                  }


                  //Buscar en el mapa por direcciones escritas
                  function mBuscarMapa(texto){
                        var address = texto;
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ 'address': address}, geocodeResult);
                    }  
                  function geocodeResult(results, status) {
                        // Verificamos el estatus
                        if (status == 'OK') {
                            // Si hay resultados encontrados, centramos y repintamos el mapa
                            // esto para eliminar cualquier pin antes puesto
                            var mapOptions = {
                                center: results[0].geometry.location,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            var map = new google.maps.Map($("#map").get(0), mapOptions);
                            // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
                            map.fitBounds(results[0].geometry.viewport);
                            // Dibujamos un marcador con la ubicación del primer resultado obtenido
                            var markerOptions = { position: results[0].geometry.location, draggable:true }
                            //var marker = new google.maps.Marker(markerOptions);    
                            marker = new google.maps.Marker(markerOptions);    

                            marker.setMap(map);
                        } else {
                            // En caso de no haber resultados o que haya ocurrido un error
                            // lanzamos un mensaje con el error
                            alert("Geocoding no tuvo éxito debido a: " + status);
                        }
                    }  

                  
                  //logica para los combos
                  function CambioDepartamento(variable){
                    var select = $("#departamento").val();
                    tBusqueda = "Peru " + select
                    limpiar("#provincia");
                    limpiar("#distrito");
                    for (i = 0; i < json.length; i++) {
                            if(json[i].name.toUpperCase()==select)
                            {
                              var provincia = json[i].province;
                              for (p = 0; p < provincia.length; p++)
                              {
                                  $('#provincia').append($('<option>',
                                     {
                                        value: provincia[p].name.toUpperCase(),
                                        text : provincia[p].name.toUpperCase()
                                    }));                
                              }
                            }
                          }
                    if(variable=="1"){
                    mBuscarMapa(tBusqueda);}
                    tBusqueda = "";   
                  }

                  function CambioProvincia(variable){
                    var select = $("#departamento").val();
                    var select1 = $("#provincia").val();
                    tBusqueda += "Peru "+select+" "+select1;
                    limpiar("#distrito");
                    for (i = 0; i < json.length; i++) {
                            if(json[i].name.toUpperCase()==select)
                            {
                              var provincia = json[i].province;
                              for (p = 0; p < provincia.length; p++)
                              {
                                  if(provincia[p].name.toUpperCase()==select1)
                                  {
                                    var distrito = provincia[p].district;
                                    for (d = 0; d < distrito.length; d++)
                                      {
                                         $('#distrito').append($('<option>',
                                           {
                                              value: distrito[d].name.toUpperCase(),
                                              text : distrito[d].name.toUpperCase()
                                          }));  
                                      }
                                  }               
                              }
                            }
                          }
                    if(variable=="1"){ 
                    mBuscarMapa(tBusqueda); } 
                    tBusqueda = "";   
                  }

                  function CambioDistrito(variable){
                    var select = $("#departamento").val();
                    var select1 = $("#provincia").val();
                    var select2 = $("#distrito").val();
                    tBusqueda += "Peru "+select+" "+select1+" "+select2;
                    if(variable=="1"){
                    mBuscarMapa(tBusqueda);}
                    tBusqueda = "";   
                  }

                  function limpiar(id){
                            $(id).empty();
                            $(id).append($('<option>',
                             {
                                value: 0,
                                text : "SELECCIONE"
                            }));
                  }

                  //Guardar direccion en el LocalStorage
                  function GuardarDireccion(){
                            var markerLatLng = marker.getPosition();
                            //alert(markerLatLng.lat() + "xxx" + markerLatLng.lng());  
                            try {
                                localStorage.setItem("Latitud", markerLatLng.lat());
                                localStorage.setItem("Longitud", markerLatLng.lng());

                                localStorage.setItem("departamento",$("#departamento").val());
                                localStorage.setItem("provincia",$("#provincia").val());
                                localStorage.setItem("distrito",$("#distrito").val());

                                alert("Los datos se guardaron correctamente");
                            }
                            catch(err) {
                                alert("Ocurrior un error al guardar la información, error : "+err.message);
                            }
                  } 


                  //Cargar los datos guardados en el LocalStorage
                  function CargarCombosStorage(){
                            var dep = localStorage.getItem("departamento"); 
                            var pro = localStorage.getItem("provincia"); 
                            var dis = localStorage.getItem("distrito");  

                            if(dep != null)
                            {
                                $("#departamento").val(dep);
                                CambioDepartamento("0");
                                if(pro!=null){
                                  $("#provincia").val(pro);
                                  CambioProvincia("0");
                                    if(dis!=null){
                                       $("#distrito").val(dis);
                                        CambioDistrito("0");
                                    }
                                }
                            }  
                  }

              