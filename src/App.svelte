<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import Manual from "./routes/Manual.svelte";
	import Automatic from "./routes/Automatic.svelte";
	import PreparedSequences from "./routes/PreparedSequences.svelte";

	export let url = "";
  </script>

  <style>
	  .link-wrapper {
		width: 49%;
		box-sizing: border-box;
		border: 4px solid deepskyblue;
		border-radius: 2px;
		padding: 1em;
		text-align: center;
		background-color: white;
	  }
	  .link-wrapper:focus {
		  border-color: blue;
	  }
  </style>

  <Router url="{url}">
	<nav>
	  <Link to="/"><button class="link-wrapper"> Configuration</button></Link>
	  <Link to="automatic"><button class="link-wrapper">Automatic</button></Link>
	</nav>
	<div>
	  <Route path="/*" component="{Manual}" />
	  <Route path="automatic/*" component="{Automatic}" />
	</div>
  </Router>