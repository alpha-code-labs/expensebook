import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';


export default function({title='Title', onDateChange, dateError, min, value}){

  const [date, setDate] = useState(value? new Date(value) : new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onDateChange(currentDate)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <SafeAreaView>
      {/* <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" /> */}

      <View className='flex flex-col max-w-[302px] h-[73px] gap-2'>
        <View className='flex flex-row items-center gap-x-2'>
          <Text style={{fontFamily:'Cabin'}} className='text-sm text-zinc-600'>{title}</Text>
          <Text className='text-xs text-red-600'>{dateError?.set  && (date===undefined || date===null) && dateError?.message}</Text>
        </View>
        

        <TouchableOpacity onPress={showDatepicker}>
          <View className='w-[302px] h-12 border border-neutral-300 px-6 py-2 rounded flex flex-row items-center'>
              {!date && <Text style={{fontFamily:'Cabin'}} className='text-sm text-neutral-400'>Select Date</Text>}
              {date && <Text style={{fontFamily:'Cabin'}} className='text-sm text-neutral-700'>{date.toLocaleDateString()}</Text>}
          </View>
        </TouchableOpacity>

      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}

          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
}


function getDateXDaysAway(days) {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + days);

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(futureDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

//{dateError?.set  && (date===undefined || date===null) && dateError?.message}