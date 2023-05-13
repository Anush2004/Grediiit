import React, { useState } from 'react';
import axios from 'axios';

function SubgreddiitFilter(props) {
    const [tags, setTags] = useState('');

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };

    const handleFilterClick = async () => {
        try {
            console.log("hi")
            // Send a GET request to the filter endpoint with the subgreddiit name and tags
            const response = await axios.post(`/api/post/filter`, {
                params: {
                    tags: tags
                }
            });

            // Call the onFilter callback with the filtered posts
            props.onFilter(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Enter tags separated by commas" value={tags} onChange={handleTagsChange} />
            <button onClick={handleFilterClick}>Filter</button>
        </div>
    );
}

export default SubgreddiitFilter;
