import { renderHook, act, waitFor } from "@testing-library/react";
import { useCharacterSubstitution } from "../../hooks/useCharacterSubstitution";
 
describe("useCharacterSubstitution hook", () => {
    const render = () => {
        const { result } = renderHook(() => useCharacterSubstitution());
        return result;
    };
 
    it("replaces starting numeric characters with underscores", async () => {
        const result = render();
 
        act(() => {
            result.current.substituteCharacters("0Calculation");
        });
 
        await waitFor(() => {
            expect(result.current.substitution).toEqual("_0Calculation");
        });
    });
 
    it("wraps reserved words with []", async () => {
        const result = render();
 
        act(() => {
            result.current.substituteCharacters("Alias");
        });
 
        await waitFor(() => {
            expect(result.current.substitution).toEqual("[Alias]");
        });
    });
 
    it("changes special characters to words", async () => {
        const result = render();
 
        act(() => {
            result.current.substituteCharacters("%");
        });
 
        await waitFor(() => {
            expect(result.current.substitution).toEqual("Percent");
        });
    });
});