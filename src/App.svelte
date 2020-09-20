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
		padding: 2em;
		display: inline;
	  }
  </style>

  <Router url="{url}">
	<nav>
	  <div class="link-wrapper"> <Link to="/">Home</Link> </div>
	  <div class="link-wrapper"> <Link to="manual">Manual</Link> </div>
	  <div class="link-wrapper"> <Link to="automatic">Automatic</Link> </div>
	  <div class="link-wrapper"> <Link to="prepared">Prepared Sequences</Link> </div>
	</nav>
	<div>
	  <Route path="manual/*" component="{Manual}" />
	  <Route path="automatic/*" component="{Automatic}" />
	  <Route path="prepared/*" component="{PreparedSequences}" />
	  <Route path="/" component="{Home}" />
	</div>
  </Router>