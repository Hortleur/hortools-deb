<script>
  import {goto} from "$app/navigation";

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token){
      goto('/login');
    }
    return true;
  }

  isLoggedIn()
</script>

<div class="container mx-auto">
  <h1 class="text-6xl text-center">Hortools</h1>

  <div class="grid grid-cols-2 grid-flow-row py-4">
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Candidature</h2>
        <p>Gestion des candidatures envoyées</p>
        <div class="card-actions justify-end">
          <a href="/candidatures" class="btn btn-primary">Aller !</a>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Portfolio</h2>
        <p>Gestion du portfolio</p>
        <div class="card-actions justify-end">
          <a href="/portfolio" class="btn btn-primary">Aller !</a>
        </div>
      </div>
    </div>
  </div>
</div>
