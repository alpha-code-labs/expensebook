export {default as airplane_icon} from './Airplane_1.svg';
export {default as train_icon} from './train.png'
export {default as bus_icon} from './bus.png'
export {default as cab_icon} from './cab-purple.svg';
export {default as chevron_down_icon} from './chevron-down.svg';
export {default as calender_icon} from './calendar.svg';
export {default as location_icon} from './location.svg';
export {default as biderectional_arrows_icon} from './double-arrow.svg';
export {default as spinner_gif_icon} from './spinning-loading.gif'
export {default as close_icon} from './x.svg'
export {default as upload_icon} from './upload.svg'
export {default as seat_icon} from './seat.svg'
export {default as scanner_icon} from './scanner.svg'
export {default as clock_icon} from './clock.svg'
export {default as add_icon} from './add.svg' 
export {default as left_arrow_icon} from './arrow-left.svg'

export {default as material_flight_black_icon} from './material-icons/outline_flight_takeoff_black_48dp.png'
export {default as material_flight_white_icon} from './material-icons/outline_flight_takeoff_white_48dp.png'
export {default as material_train_white_icon} from './material-icons/outline_train_white_48dp.png'
export {default as material_train_black_icon} from './material-icons/outline_train_black_48dp.png'
export {default as material_car_rental_black_icon} from './material-icons/outline_car_rental_black_48dp.png'
export {default as material_car_rental_white_icon} from './material-icons/outline_car_rental_white_48dp.png'
export {default as material_cab_black_icon} from './material-icons/outline_local_taxi_black_48dp.png'
export {default as material_cab_white_icon} from './material-icons/outline_local_taxi_white_48dp.png'
export {default as material_bus_black_icon} from './material-icons/outline_directions_bus_black_48dp.png'
export {default as material_bus_white_icon} from './material-icons/outline_directions_bus_white_48dp.png'
export {default as material_personal_black_icon} from './material-icons/outline_commute_black_48dp.png'
export {default as material_personal_white_icon} from './material-icons/outline_commute_white_48dp.png'
export {default as material_hotel_black_icon} from './material-icons/outline_hotel_black_48dp.png'
export {default as material_hotel_white_icon} from './material-icons/outline_hotel_white_48dp.png'
export {default as material_arrow_forward_white_icon} from './material-icons/outline_arrow_forward_white_48dp.png'
export {default as minus_icon} from './minus.svg'
//export {default as alert_circle_icon} from './alert-circle.svg';




function getFinalSchedule(slotWiseData){
	let priorityQ = [
		{combination1:0}, 
		{combination2:0}, 
		{combination3:0}, 
		{combination4:0}];
	
	const days = ['saturday', 'sunday'];
	const finalSchedule = JSON.parse(JSON.stringify(slotWiseData));
	
	for(day of days){
		for(slot in slotWiseData[day]){
			finalSchedule[day][slot] = [];
		}
	}
	
	
	
	for(day of days){
		for(slot in slotWiseData[day]){
			const countOfCombinations = slotWiseData[day][slot].length;
			
			if(countOfCombinations < 3){
				//push all combinations to final schedule
				finalSchedule[day][slot] = slotWiseData[day][slot];
				
				//populate priorityQ
				slotWiseData[day][slot].forEach(c=>{
					priorityQ[c] += 1;
				})
				
				priorityQ.sort((a,b)=>{
					 const aValue = Object.values(a)[0];
					const bValue = Object.values(b)[0];
					return aValue - bValue; 
				})
			} 
			else{
				//we need to select 2 of the given combinations
				//lowest priority combinations should be given priority
				
				let totalSelected = 0;
				
				while(totalSelected < 2){
					for(c in priorityQ){
						const ind = slotWiseData[day][slot].findIndex(pm=>pm.combination == c);
						if(ind != -1){
							finalSchedule[day][slot] = [...finalSchedule[day][slot], slotWiseData[ind]]
							priorityQ[c] += 1;
							totalSelected++;
							break;
						}
					}
					
					priorityQ.sort((a,b)=>{
						 const aValue = Object.values(a)[0];
						const bValue = Object.values(b)[0];
						return aValue - bValue; 
					})
				}
			}
		}
	}	
}