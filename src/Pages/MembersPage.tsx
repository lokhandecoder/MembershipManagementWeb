import React, { useEffect, useState } from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'
import { GetAllGenders, GetAllMembers, GetMemberByGenderId } from '../Services/MembersServices';
import { Gender, Member } from '../Models/MemberModel';

const MembersForm: React.FC = () => {

  const [data, setData] = useState<Member[]>([]);
  const [genderOptions, setGenderOptions] = useState<Gender[]>([]);
  const [selectedGenderId, setSelectedGenderId] = useState<string>('');

  // useEffect(() => { fetch('http://localhost:8082/api/subscription/getSubscriptionsasync/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genderdata = await GetAllGenders();
        setGenderOptions(genderdata);
        console.log(genderdata);
  
        if (selectedGenderId) {
          const memberdata = await GetMemberByGenderId(Number(selectedGenderId));
          setData(memberdata);
          console.log(memberdata);
        } else {
          const allMembers = await GetAllMembers();
          setData(allMembers);
          console.log(allMembers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedGenderId]);

  return (
    <LayoutComponent>
      <select onChange={(e) => setSelectedGenderId(e.target.value)}>
        <option value="">Select a Gender</option>
        {genderOptions.map((gender, index) => (
          <option key={index} value={gender.id}>
            {gender.genderName}
          </option>
        ))}
      </select>
      <GenericTable data={data}></GenericTable>
    </LayoutComponent>
  )
}

export default MembersForm