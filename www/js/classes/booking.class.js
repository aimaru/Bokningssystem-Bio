class Booking extends Base {

	constructor(showid) {
		super();
		this.auditorium = new Auditorium(showid);
		this.show = this.findShow(showid);
		this.movie = this.findMovie();
    if(!App.instanceReady) this.doOnce();
    Booking.markedSeats = [];
		this.wrongEmail = true;   // 最初は入力できる状態にしておく
		this.wrongMobile = true;
		this.bookingItems = [
			{
				type: 'ordinary',
				text: 'Ordinarie'
			},
			{
				type: 'child',
				text: 'Barn (under 12år)'
			},
			{
				type: 'pensioner',
				text: 'Pensionär'
			}];

		this.bookingItems.forEach((button, i) => {
		this.bookingItems[i] = new BookingItem(button);
		});
		Booking.showSeatNumber = this.showSeatNumber;
    setTimeout(() => {
		  this.randomGenerator();
    },0);

    
	} // Closes constructor

  doOnce() {
    this.clickPlusOrdinary();
    this.clickPlusChild();
    this.clickPlusPensioner();
    this.clickMinusOrdinary();
    this.clickMinusChild();
    this.clickMinusPensioner();
    this.saveBookingDataToJson();
    this.validateEmail();
    this.validateMobileNr();
    this.getNumberOfTicksets();
    this.onRendered();
    App.instanceReady = true;
  }

	findShow(inparameter) {
		// Finds the show and return it
		for (let i = 0; i < Data.shows.length; i++) {
			if (Data.shows[i].showid == inparameter) {
				return Data.shows[i];
			}
		}
	}

	findMovie() {
		// Finds the show and return it
		for (let i = 0; i < Data.movies.length; i++) {
			if (Data.movies[i].title == this.show.film) {
				return Data.movies[i];
			}
		}
	}

	getNumberOfTicksets() {
		let calc = Number($('#number-ordinary').text()) +
			Number($('#number-child').text()) +
			Number($('#number-pensioner').text());
      // console.log('calc', calc);
      // console.log('Ordinary', Number($('#number-ordinary').text()));
      // console.log('Child', Number($('#number-child').text()));
      // console.log('Pensionär', Number($('#number-pensioner').text()));
		Booking.selection = calc;
	}

	onRendered() {
		this.calcTotalTickets();
		this.calcTotalPrice();
		this.getNumberOfTicksets(); //updates selection
		$('.seatslefttopick').text(Booking.selection);
	}

	// Ticket - ordinary (plus button)
	clickPlusOrdinary() {
		$(document).on('click', '#plus-ordinary', () => {
			let number = Number($('#number-ordinary').text());
      console.log(number);
			number += 1;
			$('#number-ordinary').val('');
			$('#number-ordinary').html(number);
			this.onRendered();
		});
	}

	// Ticket - child (plus button)
	clickPlusChild() {
		$(document).on('click', '#plus-child', () => {
			let number = Number($('#number-child').text());
			number += 1;
			$('#number-child').html(number);
			this.onRendered();
		});
	}

	// Ticket - pensioner (plus button)
	clickPlusPensioner() {
		$(document).on('click', '#plus-pensioner', () => {
			let number = Number($('#number-pensioner').text());
			number += 1;
			$('#number-pensioner').html(number);
			this.onRendered();
		});
	}

	// Ticket - ordinary (minus button)
	clickMinusOrdinary() {
		$(document).on('click', '#minus-ordinary', () => {
			let number = Number($('#number-ordinary').text());
			if (number !== 0) {
				number -= 1;
				$('#number-ordinary').html(number);
			}
			this.onRendered();
      this.auditorium.render();
      Booking.markedSeats = [];
		});
	}

	// Ticket - child (minus button)
	clickMinusChild() {
		$(document).on('click', '#minus-child', () => {
			let number = Number($('#number-child').text());
			if (number !== 0) {
				number -= 1;
				$('#number-child').html(number);
			}
			this.onRendered();
      this.auditorium.render();
      Booking.markedSeats = [];
		});
	}

	// Ticket - pensioner (minus button)
	clickMinusPensioner() {
		$(document).on('click', '#minus-pensioner', () => {
			let number = Number($('#number-pensioner').text());
			if (number !== 0) {
				number -= 1;
				$('#number-pensioner').html(number);
			}
			this.onRendered();
      this.auditorium.render();
      Booking.markedSeats = [];
		});
	}

	calcTotalTickets() {
		let ordinaryNr = Number($('#number-ordinary').text());
		let childNr = Number($('#number-child').text());
		let pensionerNr = Number($('#number-pensioner').text());
		let sum = ordinaryNr + childNr + pensionerNr;
		if (sum !== 0) {
			$('#total-tickets').html(sum + ' st');
		}
	}

	calcTotalPrice() {
		let ordinaryNr = Number($('#number-ordinary').text());
		let childNr = Number($('#number-child').text());
		let pensionerNr = Number($('#number-pensioner').text());
		let sum = (ordinaryNr * 85) + (childNr * 65) + (pensionerNr * 75);
		$('#number-ordinary2').html(ordinaryNr + ' st');
		$('#number-child2').html(childNr + ' st');
		$('#number-pensioner2').html(pensionerNr + ' st');
		if (sum !== 0) {
			$('#amount').html(sum + ' kr');
		}
	}

	showSeatNumber() {
		$('#seat-booking').empty();
		for (let seat of Booking.markedSeats) {
			$('<li></li>').append('Rad: <span  class="mr-3 row-booking">' + seat.row + '</span>Stolnr: <span class="id-booking">' + seat.id + '</span>').appendTo('#seat-booking');
		}
	}

  randomGenerator() {
    let that = this;
    if(User.loggedIn) {getRandom();}
    $(document).one('click', '#email-booking', function (event) {  // .one = only first click
      getRandom();
    });

    function getRandom() {
      let allBookingNumbers = [];
      for (let booking of Data.booking) {
        allBookingNumbers.push(booking.bookingNr);
      }
      let newBookingNumber;
      let character = 'abcdefghijklmnopqrstuvwxyz0123456789';
      while (!newBookingNumber || allBookingNumbers.includes(newBookingNumber)) {
        newBookingNumber = Math.random().toString(36).slice(-10);
      }
      let bookingNr = newBookingNumber;
      console.log('nu körs random bokningsnummer',bookingNr);  
      $('.hide-text').show();
      $('#bookingNr-booking').html(bookingNr);
    }

  }




	validateEmail() {
		$(document).on('keyup', '#email-booking', () => {
			let email = $('#email-booking').val();
			if (!email.includes('@') || !email.includes('.') || email === '') {
				$('#email-booking').attr('data-content', 'Ange rätt email adress');
				$('#email-booking').popover('show');
				this.wrongEmail = true;
			}
			else {
				$('#email-booking').popover('hide');
				this.wrongEmail = false;
			}
		});
	}

	// Save the booking data till JSON 
	saveBookingDataToJson() {
		let that = this;
		$(document).on('click', '#booking-alert', function () {
      if(User.loggedIn) {
        that.wrongEmail = false;
        that.wrongMobile = false;
      }
			if (that.wrongEmail == true || that.wrongMobile == true) {
				return;
			}
			let title = $('#title-booking').text();
			let date = $('#date-booking').text();
			let time = $('#time-booking').text();
			let auditorium = $('#auditorium-booking').text();
			let ordinary = $('#number-ordinary2').text();
			let child = $('#number-child2').text();
			let pensioner = $('#number-pensioner2').text();
			let totalNr = $('#total-tickets').text();
			let amount = $('#amount').text();
			let bookingNr = $('#bookingNr-booking').text();
			let email = $('#email-booking').val();
			let mobile = $('#mobile-booking').val();

			let jqueryIds = $('.id-booking');
			let seats = [];
			for (let id of jqueryIds) {
				seats.push({
					id: $(id).text(),
					row: $(id).prev('.row-booking').text()
				});
			}
      let bookingData = new BookingData(
				{
					title: title,
					date: date,
					time: time,
					auditorium: auditorium,
					tickets: [
						{
							ordinary: ordinary,
							child: child,
							pensioner: pensioner,
							totalNr: totalNr
						}
					],
					amount: amount,
					seats: seats,
					bookingNr: bookingNr,
					mobile: mobile,
					email: email,
          user: User.loggedIn.email
				}
			);
      Data.booking.push(bookingData);

      //loops through the seat objects and pushes unavailable seats to the show and save to json
      for (let seat of seats) {
        seat.id = Number(seat.id)
        that.show.unavailable.push(seat);        
      }
      JSON._save('shows.json', Data.shows);

      if(User.loggedIn) {
        User.loggedIn.bookings.push(bookingData);
      }
      if(User.loggedIn) JSON._save('users/' + User.loggedIn.email, User.loggedIn);
      //////// -->


			that.saveToJSON(Data.booking);
			alert('Tack för bokning! Vi skickade ett mail till dig.');
      
      // window.location = "/"
		});
	}

	saveToJSON(array) {
		JSON._save('booking.json', array);
	}


}
