import { ErrorMessage } from "types/ErrorMessage";
import "../styles/AutoComplete.scss";

import React, { MouseEvent, useEffect, useState } from "react";

export enum AutoCompleteMode {
  Standard,
  PrefixedId, // id needs to be prefixed and suffixed with __, e.g. __1__
}

export interface AutoCompleteProps {
  suggestions: string[];
  hidden?: boolean;
  disabled?: boolean;
  includePager?: boolean;
  callback: any;
  mode?: AutoCompleteMode;
  componentId?: string;
  error?: ErrorMessage | undefined;
}

export function AutoComplete({
  suggestions,
  hidden,
  disabled,
  includePager,
  callback,
  mode = AutoCompleteMode.Standard,
  componentId,
  error,
}: AutoCompleteProps) {
  function hideSuggestions(event: any) {
    if (event.target.className !== "autocomplete-option" && event.target.id !== "input-auto-complete" && event.target.id !== componentId) {
      setAutoCompleteState(prev => ({
      ...prev,
      showSuggestions: false
    }));

    setCurrentSearchIndex(0);
    }
  }

  const [autoCompleteState, setAutoCompleteState] = useState({
    suggestions: suggestions,
    filteredSuggestions: [] as string[],
    showSuggestions: false,
    userInput: "",
    hidden: hidden,
    disabled: disabled,
  });

  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("click", hideSuggestions, false);
    return () => {
      window.removeEventListener("click", hideSuggestions, false);
    };
  }, []);

  useEffect(() => {
    setAutoCompleteState((prevState) => {
      return { ...prevState, suggestions: suggestions };
    });
  }, [suggestions]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentSearchIndex(0);
    const userInput = e.currentTarget.value;
    if (e.currentTarget.value.length === 0) {
      setAutoCompleteState((prevState) => {
        return { ...prevState, showSuggestions: false, userInput: userInput };
      });
      callback("");
    } else {
      setAutoCompleteState((prevState) => {
        return { ...prevState, showSuggestions: true, userInput: userInput };
      });
    }

    setSuggestions(userInput);
  }

  function onClickInput(e: MouseEvent<HTMLInputElement>) {
    const userSelect = e.currentTarget.value;
    setAutoCompleteState(prev => ({
      ...prev,
      showSuggestions: true
    }));
    setSuggestions(userSelect);
  }

  function setSuggestions(e: string) {
    const filteredSuggestionsArray = autoCompleteState.suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(e.toLowerCase())
    );
    setAutoCompleteState((prevState) => {
      return { ...prevState, filteredSuggestions: filteredSuggestionsArray };
    });
  }

  function listClick(e: MouseEvent<HTMLLIElement>) {
    const userSelected = e.currentTarget.innerText;
    const id = e.currentTarget.dataset.id;
    searchItem(userSelected, id);
    setCurrentSearchIndex(0);
  }

  function searchItem(value: string, id?: string) {
    setSuggestions(value);
    setAutoCompleteState((prevState) => {
      return { ...prevState, showSuggestions: false, userInput: value };
    });
    callback(id);
  }

  function getValue(rawValue: string) {
    if (mode === AutoCompleteMode.PrefixedId && rawValue.startsWith("__")) {
      const value = rawValue.split("__");
      return value[2];
    }
    return rawValue;
  }

  function getId(rawValue: string) {
    if (mode === AutoCompleteMode.PrefixedId && rawValue.startsWith("__")) {
      const value = rawValue.split("__");
      return value[1];
    }
    return rawValue;
  }

  const goBackSearch = () => {
    if (currentSearchIndex <= 0) return;
    const newSearchIndex = currentSearchIndex - 1;
    setCurrentSearchIndex(newSearchIndex);
    updateSearchItem(newSearchIndex);
  };

  const goForwardSearch = () => {
    if (currentSearchIndex >= autoCompleteState.filteredSuggestions.length - 1) return;
    const newSearchIndex = currentSearchIndex + 1;
    setCurrentSearchIndex(newSearchIndex);
    updateSearchItem(newSearchIndex);
  };

  const updateSearchItem = (index: number) => {
    const filteredItem: string = autoCompleteState.filteredSuggestions[index];
    callback(getId(filteredItem));
  };

  const hasErrors = !!error;
  
  const KEY = {
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  ENTER: "Enter",
  ESC: "Escape",
} as const;

function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  const { filteredSuggestions, showSuggestions, userInput } = autoCompleteState;

  const openSuggestions = () => {
    if (filteredSuggestions.length === 0) {
      setSuggestions(userInput);
    }

    setAutoCompleteState((prev) => ({
      ...prev,
      showSuggestions: true,
    }));
    setCurrentSearchIndex(0);
  };

  // Open dropdown first
  if (!showSuggestions) {
    if (e.key === KEY.DOWN) {
      e.preventDefault();
      openSuggestions();
    }
    return;
  }

  switch (e.key) {
    case KEY.DOWN: {
      e.preventDefault();
      if (filteredSuggestions.length === 0) return;
      setCurrentSearchIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
      break;
    }

    case KEY.UP: {
      e.preventDefault();
      if (filteredSuggestions.length === 0) return;
      setCurrentSearchIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
      break;
    }

    case KEY.ENTER: {
      e.preventDefault();
      const selected = filteredSuggestions[currentSearchIndex];
      if (!selected) return;
      searchItem(getValue(selected), getId(selected));
      break;
    }

    case KEY.ESC: {
      setAutoCompleteState((prev) => ({
        ...prev,
        showSuggestions: false,
      }));
      break;
    }

    default:
      break;
  }
}

  return (
    <>
      {includePager && (
        <label className="govuk-label" htmlFor="textarea">
          Search
          {autoCompleteState.filteredSuggestions.length > 0 && autoCompleteState.userInput.length > 0 && (
            <span className="govuk-caption-s govuk-!-margin-left-1 tb-search">
              <button onClick={goBackSearch} data-testid="back">
                ◂
              </button>{" "}
              {currentSearchIndex + 1} of {autoCompleteState.filteredSuggestions.length}{" "}
              <button onClick={goForwardSearch} data-testid="forward">
                ▸
              </button>
            </span>
          )}
        </label>
      )}
      <div className="govuk-form-group" hidden={hidden}>
        <input
          className={`govuk-input ${hasErrors ? "govuk-input--error" : ""}`}
          id={componentId?? "input-auto-complete"}
          data-testid={componentId?? "input-auto-complete"}
          type="text"
          disabled={autoCompleteState.disabled}
          autoComplete={"off"}
          onChange={onChange}
          onClick={(e) => onClickInput(e as React.MouseEvent<HTMLInputElement>)}
          value={autoCompleteState.userInput}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={autoCompleteState.showSuggestions}
          aria-controls="autocomplete-list"
          aria-activedescendant={
            autoCompleteState.filteredSuggestions[currentSearchIndex]
              ? `autocomplete-option-${currentSearchIndex}`
              : undefined
          }
          onKeyDown={onKeyDown}
        />
        <ul hidden={!autoCompleteState.showSuggestions} className="govuk-list autocomplete" id="autocomplete-list" role="listbox" >
          {autoCompleteState.filteredSuggestions.map((fs, index) => {
            const value = getValue(fs);
            const id = getId(fs);
            return (
            <li
              className={`autocomplete-option ${
                currentSearchIndex === index ? "autocomplete-option--active" : ""
              }`}
                key={index}
                role="option"
                id={`autocomplete-option-${index}`}
                aria-selected={currentSearchIndex === index}
                value={value}
                data-id={id}
                data-testid={id}
                onClick={(e) => listClick(e as React.MouseEvent<HTMLLIElement>)}
              >
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
