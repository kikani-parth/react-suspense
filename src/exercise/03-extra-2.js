// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

import * as React from "react";
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from "../pokemon";
import { createResource } from "../utils";

function PokemonInfo({ pokemonResource }) {
  const pokemon = pokemonResource.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,

  // Set this to the time of our CSS transition.
  // This is the part that says “if the transition takes X amount of time”
  busyDelayMs: 300,

  // Set this to the total time you want the transition state to persist if we surpass the busyDelayMs time.
  busyMinDurationMs: 700,
};

function createPokemonResource(pokemonName) {
  let delay = 1500;
  return createResource(fetchPokemon(pokemonName, delay));
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG);
  const [pokemonResource, setPokemonResource] = React.useState(null);

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null);
      return;
    }
    startTransition(() => {
      setPokemonResource(createPokemonResource(pokemonName));
    });
  }, [pokemonName, startTransition]);

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName("");
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? "pokemon-loading" : ""}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          "Submit a pokemon"
        )}
      </div>
    </div>
  );
}

export default App;
