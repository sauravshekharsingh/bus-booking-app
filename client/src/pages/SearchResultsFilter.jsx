import React, { useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/esm/Form";
import { filters, sorters } from "../utils/constants";

function SearchResultsFilter({
  buses,
  setBuses,
  filterOptions,
  setFilterOptions,
  sortOptions,
  setSortOptions,
}) {
  const handleFiltersSelected = (event) => {
    if (event.target.checked) {
      setFilterOptions([...filterOptions, event.target.value]);
    } else {
      setFilterOptions(
        filterOptions.filter(
          (filterOption) => filterOption !== event.target.value
        )
      );
    }
  };

  const handleSortOptionSelected = (event) => {
    if (event.target.checked) {
      setSortOptions([...sortOptions, event.target.value]);
    } else {
      setSortOptions(
        sortOptions.filter((sortOption) => sortOption !== event.target.value)
      );
    }
  };

  useEffect(() => {
    let sortedBuses = buses;

    sortOptions.forEach((option) => {
      sortedBuses = buses.sort((busA, busB) =>
        busA[option] > busB[option] ? 1 : busB[option] > busA[option] ? -1 : 0
      );
    });

    setBuses(sortedBuses);
  }, [buses, setBuses, sortOptions]);

  return (
    <Row className="mt-2 mb-4">
      <Col>
        <p className="h5">Filters</p>
        {filters.map((facility) => (
          <Form.Check
            inline
            label={facility}
            value={facility}
            name="facility"
            type="checkbox"
            defaultChecked
            id={facility}
            key={facility}
            onChange={handleFiltersSelected}
          />
        ))}
      </Col>
      <Col>
        <p className="h5">Sort</p>
        {sorters.map((sortOption) => (
          <Form.Check
            inline
            label={sortOption}
            value={sortOption}
            name="sortOption"
            type="checkbox"
            defaultChecked
            id={sortOption}
            key={sortOption}
            onChange={handleSortOptionSelected}
          />
        ))}
      </Col>
    </Row>
  );
}

export default SearchResultsFilter;
