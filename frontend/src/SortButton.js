import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const SortPage = () => {
  const [subs, setSubs] = useState([]);
  const [selectedSortCriteria, setSelectedSortCriteria] = useState([]);

  useEffect(() => {
    const fetchSubs = async () => {
      const result = await axios.get('/api/sub/list-sub');
      setSubs(result.data);
      console.log(result.data);
    };
    fetchSubs();
  }, []);

  const handleSort = (criteria) => {
    setSelectedSortCriteria(criteria);
  };

  const sortByNameAsc = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };

  const sortByNameDesc = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA > nameB) return -1;
    if (nameA < nameB) return 1;
    return 0;
  };

  const sortByFollowersDesc = (a, b) => {
    return b.users.filter(user => user.status === 'joined').length -  a.users.filter(user => user.status === 'joined').length ;
    
  };

  const sortByCreationDate = (a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  };

  const sortedSubs = useMemo(() => {
    let sorted = [...subs];
    if (selectedSortCriteria.includes('creationDate')) {
      sorted = sorted.sort(sortByCreationDate);
    }
    if (selectedSortCriteria.includes('followersDesc')) {
      sorted = sorted.sort(sortByFollowersDesc);
    }
    if (selectedSortCriteria.includes('nameAsc')) {
      sorted = sorted.sort(sortByNameAsc);
    } else if (selectedSortCriteria.includes('nameDesc')) {
      sorted = sorted.sort(sortByNameDesc);
    }
    
   
    return sorted;
  }, [subs, selectedSortCriteria]);

  return (
    <div className="sort-page-container">
      <div className="sort-options-container">
        <label>
          <input
            type="checkbox"
            onChange={() =>
              handleSort(
                selectedSortCriteria.includes('nameAsc')
                  ? selectedSortCriteria.filter((c) => c !== 'nameAsc')
                  : [...selectedSortCriteria, 'nameAsc']
              )
            }
          />
          <span className="sort-option-label">Name (Ascending) Priority 1</span>
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() =>
              handleSort(
                selectedSortCriteria.includes('nameDesc')
                  ? selectedSortCriteria.filter((c) => c !== 'nameDesc')
                  : [...selectedSortCriteria, 'nameDesc']
              )
            }
          />
          <span className="sort-option-label">Name (Descending) Priority 1</span>
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() =>
              handleSort(
                selectedSortCriteria.includes('followersDesc')
                  ? selectedSortCriteria.filter((c) => c !== 'followersDesc')
                  : [...selectedSortCriteria, 'followersDesc']
              )
            }
          />
          <span className="sort-option-label">Followers (Descending) Priority 2</span>
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() =>
              handleSort(
                selectedSortCriteria.includes('creationDate')
                  ? selectedSortCriteria.filter((c) => c !== 'creationDate')
                  : [...selectedSortCriteria, 'creationDate']
              )
            }
          />
          <span className="sort-option-label">Creation Date Priority 3</span>
        </label>
      </div>
      {sortedSubs.map((sub) => (
        <div className="sub-greddiit" key={sub.name}>
        <Link to={`/posts/${sub.name}`}>
            <h3 className="Link">{sub.name}</h3>
        </Link>
        <h4 className="mod">Created By: {sub.Mod_uname}</h4>
        <div className="sub-desc">
            <p className="desc">Description:{sub.description}</p>
        </div>
        <div className="sub-info">
            <p>Number of people: {sub.users.filter(user => user.status === 'joined').length + sub.users.filter(user => user.status === 'created').length}</p>
            <p>Created at: {new Date(sub.dateCreated).toLocaleDateString()}</p>
            <p>Number of posts: {sub.posts.length}</p>
           
        </div>
        <div className="banned">
            <p>Banned: {sub.banned.map((element, index) => {
                return index === sub.banned.length - 1 ? element : element + ', ';
            })}</p>
        </div>
    </div>
      ))}
    </div>
  );
};

export default SortPage;
